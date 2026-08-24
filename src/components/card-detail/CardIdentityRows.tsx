import { Row } from '@/components/ui/Row';

const NETWORK_LABELS = {
  VISA: 'Visa',
  MASTERCARD: 'Mastercard',
  AMEX: 'Amex',
  DISCOVER: 'Discover',
} as const;

interface CardIdentityRowsProps {
  network: keyof typeof NETWORK_LABELS;
  issuerDisplayName: string;
  last4?: string | null;
}

/**
 * Two identity rows: network + card number, issuer + bank sign-in.
 *
 * Both right-hand actions are rendered inert rather than as live purple
 * affordances. Bank sign-in depends on account sync, which does not exist
 * yet, and this app deliberately never asks for a full card number — it
 * tracks benefits and has no use for a PAN, so offering the field would
 * invite people to hand over card data for nothing. Showing them greyed
 * keeps the screen's shape without implying either one works.
 */
export function CardIdentityRows({ network, issuerDisplayName, last4 }: CardIdentityRowsProps) {
  return (
    <div className="divide-y divide-neutral-200/80 border-y border-neutral-200/80 px-5">
      <Row
        className="py-3.5"
        right={
          <span className="text-[15px] font-medium text-neutral-400">
            {last4 ? 'Card ending saved' : 'Not linked'}
          </span>
        }
      >
        <span className="text-[15px] font-semibold text-neutral-900">{NETWORK_LABELS[network]}</span>
        <span className="ml-3 text-[15px] text-neutral-400">{last4 ? `•••• ${last4}` : '--'}</span>
      </Row>
      <Row
        className="py-3.5"
        right={
          <span className="text-[15px] font-medium text-neutral-400" aria-disabled="true">
            Sign-in coming soon
          </span>
        }
      >
        <span className="text-[15px] font-semibold text-neutral-900">{issuerDisplayName}</span>
        <span className="ml-3 text-[15px] text-neutral-400">--</span>
      </Row>
    </div>
  );
}
