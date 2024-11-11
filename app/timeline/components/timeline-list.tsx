'use client';

import React, { Suspense } from 'react';
import { TimelineItem } from './timeline-Item';
import { TimelineProps } from '@/types/timeline';
import { cn } from '@/lib/utils';

export const TimelineList = ({
  items,
  activeIndex,
  onItemClick,
}: TimelineProps) => {
  if (!items?.length) {
    return <div className="text-center py-8">No timeline items found</div>;
  }

  return (
    <Suspense 
      fallback={<div className="text-center py-8 text-muted-foreground">
        Loading timeline...
      </div>}
    >
      <div className="relative py-8">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
        {items.map((item, index) => (
          <div
            key={item.id}
            id={`timeline-item-${index}`}
            className={cn(
              "relative flex gap-8 mb-12 px-4",
              index % 2 === 0 ? "flex-row" : "flex-row-reverse",
            )}
          >
            <TimelineItem
              item={item}
              isActive={index === activeIndex}
              onClick={() => onItemClick(item.id, index)}
            />
          </div>
        ))}
      </div>
    </Suspense>
  );
};