'use client';

/**
 * Client island for the Cards tab. Composes the card-detail components
 * (owned by W4) exactly as the dev proving ground does, and wires their
 * `on*` affordances to the real server actions:
 *   - carousel selection → ?card= search param
 *   - points conversion → setRedemptionMethod
 *   - redeemable benefit tap → redeem sheet → recordRedemption / undoLastEntry
 *   - remove card → removeCard
 */
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { recordRedemption, undoLastEntry } from '@/app/actions/benefits';
import { removeCard, setRedemptionMethod } from '@/app/actions/cards';
import { AnnualFeePanel } from '@/components/card-detail/AnnualFeePanel';
import { CardCarousel, type CarouselCard } from '@/components/card-detail/CardCarousel';
import { CardIdentityRows } from '@/components/card-detail/CardIdentityRows';
import { DataAsOfNote } from '@/components/card-detail/DataAsOfNote';
import { DetailBalanceTabs, type DetailBalanceTab } from '@/components/card-detail/DetailBalanceTabs';
import { OtherBenefits } from '@/components/card-detail/OtherBenefits';
import { PointsConversion, type RedemptionMethod } from '@/components/card-detail/PointsConversion';
import { RatesAndFees } from '@/components/card-detail/RatesAndFees';
import { RedeemableBenefits } from '@/components/card-detail/RedeemableBenefits';
import { RemoveCardButton } from '@/components/card-detail/RemoveCardButton';
import { RewardsSection } from '@/components/card-detail/RewardsSection';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Sheet } from '@/components/ui/Sheet';
import { formatCents } from '@/lib/format';
import { parseDollarsToCents } from '@/lib/money';
import type { WalletWiring } from '@/lib/queries';
import type { BenefitVM, CardVM } from '@/lib/view-models';

interface CardsScreenProps {
  cards: CardVM[];
  wiring: WalletWiring;
  initialSelectedId: string;
}

export default function CardsScreen({ cards, wiring, initialSelectedId }: CardsScreenProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [tab, setTab] = useState<DetailBalanceTab>('details');
  // Optimistic redemption-method override per card, so the select doesn't
  // snap back while the server action + revalidation round-trips.
  const [methodOverride, setMethodOverride] = useState<Record<string, RedemptionMethod>>({});
  const [redeemSlug, setRedeemSlug] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Props refresh after every action; fall back when the selected card is gone.
  const card = cards.find((c) => c.userCardId === selectedId) ?? cards[0];

  const carouselCards: CarouselCard[] = cards.map((c) => ({
    id: c.userCardId,
    name: c.shortName,
    network: c.network,
    art: c.art,
  }));

  const selectCard = (id: string) => {
    setSelectedId(id);
    setRedeemSlug(null);
    router.replace(`/cards?card=${encodeURIComponent(id)}`, { scroll: false });
  };

  const currencySlug = wiring.currencySlugByCardId[card.userCardId];
  const method = methodOverride[card.userCardId] ?? card.redemptionMethod;

  const changeMethod = (next: RedemptionMethod) => {
    if (!currencySlug) return;
    setMethodOverride((prev) => ({ ...prev, [card.userCardId]: next }));
    startTransition(async () => {
      await setRedemptionMethod(currencySlug, next);
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeCard(card.userCardId);
      router.replace('/cards');
    });
  };

  const redeemBenefit = redeemSlug ? card.redeemable.find((b) => b.slug === redeemSlug) ?? null : null;

  return (
    <div className="bg-white pb-10 pt-4">
      <CardCarousel cards={carouselCards} selectedId={card.userCardId} onSelect={selectCard} />
      <h1 className="mt-5 px-5 text-center text-[21px] font-bold text-neutral-900">{card.name}</h1>
      <div className="mt-4">
        <CardIdentityRows
          network={card.network}
          issuerDisplayName={card.issuerDisplayName}
          last4={card.last4}
        />
      </div>
      <div className="mt-4">
        <DetailBalanceTabs value={tab} onChange={setTab} />
      </div>
      {tab === 'balance' ? (
        <p className="mt-10 px-5 text-center text-[13px] text-neutral-400">
          Balance needs a connected account — sync is coming in a future update.
        </p>
      ) : (
        <>
          {card.pointsCurrencyName ? (
            <div className="mt-7">
              <PointsConversion value={method} onChange={changeMethod} />
              {card.centsPerPointLabel ? (
                <p className="mt-2 px-5 text-[12px] text-neutral-500">
                  {card.pointsCurrencyName} valued at {card.centsPerPointLabel}.
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="mt-8">
            <AnnualFeePanel annualFeeLabel={card.annualFeeLabel} />
          </div>
          <div className="mt-8">
            <RewardsSection rewards={card.rewards} />
          </div>
          <div className="mt-8">
            <RedeemableBenefits benefits={card.redeemable} onSelect={(slug) => setRedeemSlug(slug)} />
          </div>
          <div className="mt-8">
            <OtherBenefits benefits={card.other} />
          </div>
          <div className="mt-8">
            <RatesAndFees
              annualFeeLabel={card.annualFeeLabel}
              aprLabel={card.aprLabel}
              foreignTxFeeLabel={card.foreignTxFeeLabel}
            />
          </div>
          <div className="mt-8">
            <RemoveCardButton cardName={card.shortName} onRemove={handleRemove} />
          </div>
          <div className="mt-6">
            <DataAsOfNote dataAsOf={card.dataAsOf} sourceUrl={card.sourceUrl} />
          </div>
        </>
      )}
      {redeemBenefit ? (
        <RedeemSheet
          key={`${card.userCardId}:${redeemBenefit.slug}`}
          benefit={redeemBenefit}
          userCardBenefitId={wiring.benefitIdByKey[`${card.userCardId}:${redeemBenefit.slug}`]}
          onClose={() => setRedeemSlug(null)}
        />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Redeem flow
// ---------------------------------------------------------------------------

interface RedeemSheetProps {
  benefit: BenefitVM;
  userCardBenefitId: string | undefined;
  onClose: () => void;
}

/**
 * Bottom sheet for recording usage: shows the current period window and the
 * amount still available, offers "mark full amount used" plus a partial
 * dollar input, and an undo for the most recent entry.
 */
function RedeemSheet({ benefit, userCardBenefitId, onClose }: RedeemSheetProps) {
  const [amountText, setAmountText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recordedPeriodId, setRecordedPeriodId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const period = benefit.currentPeriod;
  const isPointsGrant = benefit.kind === 'POINTS_GRANT';

  const submit = (amountCents?: number) => {
    if (!userCardBenefitId) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await recordRedemption(
          userCardBenefitId,
          isPointsGrant ? {} : { amountCents },
        );
        setRecordedPeriodId(result.benefitPeriodId);
        setAmountText('');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not record that — try again.');
      }
    });
  };

  const submitPartial = () => {
    const cents = parseDollarsToCents(amountText);
    if (cents === null || cents <= 0) {
      setError('Enter a dollar amount like 25 or 12.50.');
      return;
    }
    submit(cents);
  };

  const undo = () => {
    const periodId = recordedPeriodId ?? period?.id ?? null;
    if (!periodId) return;
    setError(null);
    startTransition(async () => {
      try {
        await undoLastEntry(periodId);
        setRecordedPeriodId(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not undo — try again.');
      }
    });
  };

  const canUndo = recordedPeriodId !== null || (period?.id != null && period.usedCents > 0);

  return (
    <Sheet open onClose={onClose} title={benefit.shortTitle}>
      {period ? (
        <>
          <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-neutral-500">Current window</span>
              <span className="text-[13px] font-semibold text-neutral-900">{period.label}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-neutral-500">Days left</span>
              <span className="text-[13px] font-semibold text-neutral-900">
                {period.daysLeft === 1 ? '1 day' : `${period.daysLeft} days`}
              </span>
            </div>
            {period.valueCents != null ? (
              <>
                <div className="mt-3">
                  <ProgressBar percent={period.percentUsed} />
                </div>
                <p className="mt-2 text-[13px] text-neutral-600">
                  <strong className="font-semibold text-neutral-900">
                    {formatCents(period.remainingCents)}
                  </strong>{' '}
                  still available · {formatCents(period.usedCents)} of {formatCents(period.valueCents)} used
                </p>
              </>
            ) : null}
          </div>

          {period.remainingCents > 0 ? (
            <button
              type="button"
              disabled={pending || !userCardBenefitId}
              onClick={() => submit(period.remainingCents)}
              className="mt-4 h-12 w-full rounded-2xl bg-[#6C5CE7] text-[15px] font-semibold text-white disabled:opacity-50"
            >
              {isPointsGrant ? 'Mark points received' : `Mark full amount used (${formatCents(period.remainingCents)})`}
            </button>
          ) : (
            <p className="mt-4 text-center text-[13px] font-medium text-[#1C9E5F]">
              Fully used for this window — nice.
            </p>
          )}

          {!isPointsGrant && period.remainingCents > 0 ? (
            <div className="mt-3">
              <label htmlFor="redeem-partial" className="text-[13px] font-medium text-neutral-800">
                Or record a partial amount
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  id="redeem-partial"
                  inputMode="decimal"
                  placeholder="$0.00"
                  value={amountText}
                  onChange={(event) => setAmountText(event.target.value)}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-neutral-300 bg-white px-4 text-[15px] text-neutral-900"
                />
                <button
                  type="button"
                  disabled={pending || !userCardBenefitId}
                  onClick={submitPartial}
                  className="h-12 shrink-0 rounded-xl bg-neutral-900 px-5 text-[15px] font-semibold text-white disabled:opacity-50"
                >
                  Record
                </button>
              </div>
            </div>
          ) : null}

          {canUndo ? (
            <button
              type="button"
              disabled={pending}
              onClick={undo}
              className="mt-3 h-11 w-full rounded-2xl bg-neutral-100 text-[14px] font-semibold text-neutral-900 disabled:opacity-50"
            >
              Undo last entry
            </button>
          ) : null}

          {error ? <p className="mt-3 text-center text-[13px] text-[#E0383E]">{error}</p> : null}
        </>
      ) : (
        <p className="mt-4 text-center text-[14px] leading-5 text-neutral-600">
          This benefit has no active window right now.
        </p>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-4 h-12 w-full rounded-2xl bg-neutral-100 text-[15px] font-semibold text-neutral-900"
      >
        Close
      </button>
    </Sheet>
  );
}
