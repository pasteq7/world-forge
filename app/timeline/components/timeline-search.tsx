'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimelineSearchProps } from '@/types/timeline';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatYearRange } from '@/lib/date-utils';
import { useMemo, useEffect } from 'react';
import { debounce } from 'lodash';

export const TimelineSearch = ({
  searchQuery,
  onSearchChange,
  filteredItems,
  activeIndex,
  onItemSelect,
}: Omit<TimelineSearchProps, 'isCollapsible'>) => {
  const debouncedOnChange = useMemo(
    () => debounce((value: string) => onSearchChange(value), 300),
    [onSearchChange]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value.trim();
      debouncedOnChange(value);
    } catch (error) {   
      console.error('Search error:', error);
      onSearchChange('');
    }
  };

  return (
    <div className="card absolute right-0 w-[400px] shadow-lg">
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1.5 h-4 w-4 text-muted-foreground " />
          <Input
            placeholder="Search events..."
            className="pl-8 h-7 text-sm"
            defaultValue={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-2 flex flex-col gap-1 bg-background">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              role="option"
              tabIndex={0}
              aria-selected={activeIndex === index}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onItemSelect(index);
                }
              }}
              className={cn(
                "p-2 rounded-md cursor-pointer transition-all ",
                "hover:bg-accent",
                activeIndex === index && "bg-accent",
                "border border-transparent",
                activeIndex === index && "border-border"
              )}
              onClick={() => onItemSelect(index)}
            >
              <div className="flex items-center justify-between gap-2">
                <Badge 
                  variant={item.type === 'timePeriod' ? 'secondary' : 'default'} 
                  className="text-[10px] px-1 h-4"
                >
                  {item.subType}
                </Badge>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {formatYearRange(item.date.start, item.date.end)}
                </span>
              </div>
              <h4 className="font-medium text-xs mt-1 line-clamp-1">{item.name}</h4>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};