'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimelineItemType } from '@/types/timeline';
import { cn } from '@/lib/utils';
import { formatYearRange } from '@/lib/date-utils';

interface TimelineItemProps {
  item: TimelineItemType;
  isActive: boolean;
  onClick: () => void;
  index: number;
  position: 'left' | 'right';
}

export const TimelineItem = ({
  item,
  isActive,
  onClick,
}: Omit<TimelineItemProps, 'index' | 'position'>) => {
  return (
    <>
      <Card
        role="tab"
        tabIndex={0}
        aria-selected={isActive}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
        className={cn(
          "w-[calc(50%-2.5rem)]",
          "cursor-pointer hover:shadow-lg transition-all duration-200",
          item.type === 'timePeriod' ? 'border-secondary' : 'border-primary',
          "hover:-translate-y-1",
          isActive && "ring-2 ring-primary ring-offset-2"
        )}
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={item.type === 'timePeriod' ? 'secondary' : 'default'}>
              {item.subType}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatYearRange(item.date.start, item.date.end)}
            </span>
          </div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            {item.description}
          </p>
        </div>
      </Card>

      {/* Center marker with tooltip */}
      <div className="relative flex-shrink-0 w-5 flex items-center">
        <div className="group absolute w-4 h-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div 
            className={cn(
              "w-full h-full rounded-full border-4 border-background transition-all duration-200",
              "group-hover:scale-125",
              item.type === 'timePeriod' ? 'bg-secondary' : 'bg-primary'
            )}
          />
          <div className="absolute left-1/2 -translate-x-1/2 top-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs bg-background border px-2 py-1 rounded z-10">
            {item.formattedDate}
          </div>
        </div>
      </div>

      {/* Empty space for opposite side */}
      <div className="w-[calc(50%-2.5rem)]" />
    </>
  );
};