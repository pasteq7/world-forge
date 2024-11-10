import { Event, TimePeriod, UUID } from '@/types/core';

export type TimelineItemType = 
  | (Event & { type: 'event'; formattedDate: string })
  | (TimePeriod & { type: 'timePeriod'; formattedDate: string });

export interface TimelineProps {
  items: TimelineItemType[];
  activeIndex: number;
  onItemClick: (id: UUID, index: number) => void;
}

export interface TimelineControlsProps {
  onNavigate: (direction: 'up' | 'down') => void;
  isAtStart: boolean;
  isAtEnd: boolean;
}

export interface TimelineSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredItems: TimelineItemType[];
  activeIndex: number;
  onItemSelect: (index: number) => void;
  isCollapsible: boolean;
}

export interface TimelineItemProps {
  item: TimelineItemType;
  isActive: boolean;
  onClick: () => void;
  index: number;
  position: 'left' | 'right';
}