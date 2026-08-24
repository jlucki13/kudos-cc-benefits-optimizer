'use client';

import { useState } from 'react';

import type { BenefitVM } from '@/lib/view-models';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Row } from '@/components/ui/Row';
import { Section } from '@/components/ui/Section';
import { formatCents } from '@/components/ui/format';
import { ChevronRightIcon, ChevronUpIcon } from '@/components/ui/icons';

interface RedeemableBenefitsProps {
  benefits: BenefitVM[];
  onSelect?: (slug: string) => void;
}

/** Highlighted benefits first; the rest expand behind a purple "Show more". */
export function RedeemableBenefits({ benefits, onSelect }: RedeemableBenefitsProps) {
  const [expanded, setExpanded] = useState(false);
  const highlighted = benefits.filter((benefit) => benefit.isHighlighted);
  const hidden = benefits.filter((benefit) => !benefit.isHighlighted);
  const visible = expanded ? [...highlighted, ...hidden] : highlighted;
  return (
    <Section title="Redeemable benefits">
      <div className="divide-y divide-neutral-100 px-5">
        {visible.map((benefit) => (
          <BenefitRow key={benefit.slug} benefit={benefit} onSelect={onSelect} />
        ))}
      </div>
      {hidden.length > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex items-center gap-1 px-5 py-2 text-[15px] font-medium text-[#6C5CE7]"
        >
          {expanded ? 'Show less' : 'Show more'}
          {expanded ? <ChevronUpIcon size={16} /> : <ChevronRightIcon size={16} />}
        </button>
      ) : null}
    </Section>
  );
}

function BenefitRow({ benefit, onSelect }: { benefit: BenefitVM; onSelect?: (slug: string) => void }) {
  const period = benefit.currentPeriod;
  const content = (
    <Row
      align="start"
      className="py-3.5"
      left={<BrandIcon brandKey={benefit.brandKey ?? benefit.shortTitle} />}
      right={<ChevronRightIcon size={18} className="mt-2 text-neutral-300" />}
    >
      <p className="line-clamp-2 text-left text-[15px] font-medium leading-snug text-neutral-900">
        {benefit.title}
      </p>
      <p className="mt-0.5 text-left text-[13px] text-neutral-500">{benefit.cadenceLabel}</p>
      {period && period.valueCents != null && period.usedCents > 0 ? (
        <div className="mt-2 pr-1">
          <ProgressBar percent={period.percentUsed} />
          <p className="mt-1 text-left text-[12px] text-neutral-500">
            {formatCents(period.usedCents)} of {formatCents(period.valueCents)} used
          </p>
        </div>
      ) : null}
    </Row>
  );
  if (!onSelect) return content;
  return (
    <button type="button" onClick={() => onSelect(benefit.slug)} className="block w-full">
      {content}
    </button>
  );
}
