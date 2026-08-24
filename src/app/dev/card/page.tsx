'use client';

import { useState } from 'react';

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
import { catalogFixture, csrFixture } from '@/lib/fixtures';

/**
 * Dev proving ground for the card-detail workstream. Renders the full screen
 * from `csrFixture` in a 390px column — no data layer, no routing.
 */
const carouselCards: CarouselCard[] = [
  {
    id: csrFixture.userCardId,
    name: csrFixture.shortName,
    network: csrFixture.network,
    art: csrFixture.art,
  },
  ...catalogFixture
    .filter((entry) => entry.slug !== csrFixture.slug)
    .map((entry) => ({
      id: `fixture-${entry.slug}`,
      name: entry.shortName,
      network: entry.network,
      art: entry.art,
    })),
];

export default function CardDevPage() {
  const card = csrFixture;
  const [selectedId, setSelectedId] = useState(carouselCards[0].id);
  const [tab, setTab] = useState<DetailBalanceTab>('details');
  const [method, setMethod] = useState<RedemptionMethod>(card.redemptionMethod);
  const [removed, setRemoved] = useState(false);

  return (
    <div className="flex min-h-dvh justify-center bg-[#E9E9EE]">
      <main className="w-full max-w-[390px] bg-white pb-12 pt-5 shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <CardCarousel cards={carouselCards} selectedId={selectedId} onSelect={setSelectedId} />
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
            The Balance view is not part of this preview. Switch back to Details.
          </p>
        ) : (
          <>
            <div className="mt-7">
              <PointsConversion value={method} onChange={setMethod} />
            </div>
            <div className="mt-8">
              <AnnualFeePanel annualFeeLabel={card.annualFeeLabel} />
            </div>
            <div className="mt-8">
              <RewardsSection rewards={card.rewards} />
            </div>
            <div className="mt-8">
              <RedeemableBenefits benefits={card.redeemable} />
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
              <RemoveCardButton cardName={card.shortName} onRemove={() => setRemoved(true)} />
            </div>
            {removed ? (
              <p className="mt-3 px-5 text-center text-[12px] text-neutral-400">
                Card removed (preview only — no data changed).
              </p>
            ) : null}
            <div className="mt-6">
              <DataAsOfNote dataAsOf={card.dataAsOf} sourceUrl={card.sourceUrl} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
