import EmptyWallet from '@/components/shell/EmptyWallet';
import TopBar from '@/components/shell/TopBar';
import TopTabs from '@/components/shell/TopTabs';
import { asOfDate } from '@/lib/as-of';
import { getWalletCards, getWalletWiring } from '@/lib/queries';

import CardsScreen from './CardsScreen';

/**
 * The Cards tab: carousel of wallet cards + full detail for the selected one.
 * Selection lives in `?card=<userCardId>` so a card deep-links and survives
 * reload; an unknown or missing id falls back to the first card.
 */
export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const cards = await getWalletCards(asOfDate());

  if (cards.length === 0) {
    return (
      <>
        <TopBar />
        <TopTabs active="cards" />
        <EmptyWallet />
      </>
    );
  }

  const wiring = await getWalletWiring();
  const requested = typeof sp.card === 'string' ? sp.card : undefined;
  const initialSelectedId = cards.some((c) => c.userCardId === requested)
    ? (requested as string)
    : cards[0].userCardId;

  return (
    <>
      <TopBar />
      <TopTabs active="cards" />
      <CardsScreen cards={cards} wiring={wiring} initialSelectedId={initialSelectedId} />
    </>
  );
}
