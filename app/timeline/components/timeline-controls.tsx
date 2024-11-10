'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TimelineControlsProps } from '@/types/timeline';

export const TimelineControls = ({
  onNavigate,
  isAtStart,
  isAtEnd,
}: TimelineControlsProps) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate('up')}
        disabled={isAtStart}
        aria-label="Navigate up"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate('down')}
        disabled={isAtEnd}
        aria-label="Navigate down"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};