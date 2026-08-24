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
 * Two identity rows: network + card number placeholder, issuer + sign-in.
 * The purple actions are affordances only — the parent wires (or ships) them.
 */
export function CardIdentityRows({ network, issuerDisplayName, last4 }: CardIdentityRowsProps) {
  return (
    <div className="divide-y divide-neutral-200/80 border-y border-neutral-200/80 px-5">
      <Row
        className="py-3.5"
        right={<span className="text-[15px] font-medium text-[#6C5CE7]">Add your card number</span>}
      >
        <span className="text-[15px] font-semibold text-neutral-900">{NETWORK_LABELS[network]}</span>
        <span className="ml-3 text-[15px] text-neutral-400">{last4 ? `•••• ${last4}` : '--'}</span>
      </Row>
      <Row
        className="py-3.5"
        right={
          <span className="text-[15px] font-medium text-[#6C5CE7]">Sign in with {issuerDisplayName} Bank</span>
        }
      >
        <span className="text-[15px] font-semibold text-neutral-900">{issuerDisplayName}</span>
        <span className="ml-3 text-[15px] text-neutral-400">--</span>
      </Row>
    </div>
  );
}
