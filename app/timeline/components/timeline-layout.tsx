'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TimelineList } from './timeline-list';
import { TimelineSearch } from './timeline-search';
import { TimelineControls } from './timeline-controls';
import { EntitySheet } from '@/components/common/entity-sheet';
import { useTimelineNavigation } from '@/app/timeline/hooks/useTimelineNavigation';
import { useTimelineWheel } from '@/app/timeline/hooks/useTimelineWheel';
import { TimelineItemType } from '@/types/timeline';
import { formatHistoricalDate, compareDates } from '@/lib/date-utils';
import { isEvent, isTimePeriod, UUID } from '@/types/core';
import { useWorldStore } from '@/store/world-store';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTimelineScroll } from '@/app/timeline/hooks/useTimelineScroll';

export const EventTimeline = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<UUID | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isWheelNavigating, setIsWheelNavigating] = useState(false);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const entities = useWorldStore(state => state.entities);

  const timelineItems = React.useMemo<TimelineItemType[]>(() => {
    const events = entities
      .filter(isEvent)
      .map(e => ({
        id: e.id,
        type: e.type,
        name: e.name,
        formattedDate: formatHistoricalDate(e.date.start),
        description: e.description,
        date: e.date,
        summary: e.summary,
        tags: e.tags,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        lastViewed: e.lastViewed,
        subType: e.subType,
        consequences: e.consequences
      }));
    
    const periods = entities
      .filter(isTimePeriod)
      .map(e => ({
        id: e.id,
        type: e.type,
        name: e.name,
        formattedDate: formatHistoricalDate(e.date.start),
        description: e.description,
        date: e.date,
        summary: e.summary,
        tags: e.tags,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        lastViewed: e.lastViewed,
        subType: e.subType,
        majorChanges: e.majorChanges,
        culturalCharacteristics: e.culturalCharacteristics,
        technologicalLevel: e.technologicalLevel
      }));
  
    return [...events, ...periods]
      .sort((a, b) => compareDates(a.date.start, b.date.start));
  }, [entities]);

  const useFilteredItems = (items: TimelineItemType[], query: string) => {
    return React.useMemo(() => {
      if (!query) return items;
      const searchLower = query.toLowerCase();
      return items.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }, [items, query]);
  };

  const filteredItems = useFilteredItems(timelineItems, searchQuery);

  const { navigateTimeline, activeIndex, setActiveIndex } = useTimelineNavigation(timelineItems.length);

  const { handleScroll } = useTimelineScroll({
    timelineItems,
    setActiveIndex,
    isWheelNavigating,
  });

  useEffect(() => {
    const container = timelineRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleItemClick = (id: UUID, index: number) => {
    setSelectedId(id);
    setDialogOpen(true);
    setActiveIndex(index);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsListOpen(false);
      }
    };

    if (isListOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isListOpen]);

  useTimelineWheel({ 
    timelineRef, 
    navigateTimeline,
    onWheelStart: () => setIsWheelNavigating(true),
    onWheelEnd: () => setIsWheelNavigating(false),
  });

  const scrollToIndex = (index: number) => {
    const element = document.getElementById(`timeline-item-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="sticky top-2 z-50" ref={listRef}>
        <Collapsible open={isListOpen} onOpenChange={setIsListOpen}>
          <div className="flex justify-end mb-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="px-3 h-8">
                <Search className="h-4 w-4 mr-2" />
                <span className="text-sm">Browse Events</span>
                {isListOpen ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <TimelineSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filteredItems={filteredItems}
              activeIndex={activeIndex}
              onItemSelect={(index) => {
                setActiveIndex(index);
                setIsListOpen(false);
                scrollToIndex(index);
              }}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="relative" ref={timelineRef}>
        <TimelineControls
          onNavigate={navigateTimeline}
          isAtStart={activeIndex === 0}
          isAtEnd={activeIndex === timelineItems.length - 1}
        />

        <TimelineList
          items={timelineItems}
          activeIndex={activeIndex}
          onItemClick={handleItemClick}
        />

        {selectedId && (
          <EntitySheet
            entityId={selectedId}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        )}
      </div>
    </div>
  );
};