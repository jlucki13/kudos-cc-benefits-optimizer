'use client';

import { useState } from 'react';

import type { BenefitVM } from '@/lib/view-models';
import { Row } from '@/components/ui/Row';
import { Section } from '@/components/ui/Section';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TagIcon } from '@/components/ui/icons';

const COLLAPSED_COUNT = 2;

interface OtherBenefitsProps {
  benefits: BenefitVM[];
}

/** Non-dollar benefits (thresholds, perks). Collapsed to two rows by default. */
export function OtherBenefits({ benefits }: OtherBenefitsProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? benefits : benefits.slice(0, COLLAPSED_COUNT);
  return (
    <Section title="Other benefits">
      <div className="divide-y divide-neutral-100 px-5">
        {visible.map((benefit) => (
          <Row
            key={benefit.slug}
            align="start"
            className="py-3.5"
            left={
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                <TagIcon size={16} />
              </span>
            }
            right={<ChevronRightIcon size={18} className="mt-2 text-neutral-300" />}
          >
            <p className="text-[15px] font-medium leading-snug text-neutral-900">{benefit.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[13px] leading-5 text-neutral-500">{benefit.description}</p>
          </Row>
        ))}
      </div>
      {benefits.length > COLLAPSED_COUNT ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex items-center gap-1 px-5 py-2 text-[15px] font-medium text-[#6C5CE7]"
        >
          {expanded ? 'Show less' : 'Show more'}
          {expanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
        </button>
      ) : null}
    </Section>
  );
}
