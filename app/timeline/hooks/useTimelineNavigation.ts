'use client';

import { useCallback, useEffect, useState } from 'react';

export const useTimelineNavigation = (itemsCount: number) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToItem = useCallback((index: number) => {
    try {
      const element = document.getElementById(`timeline-item-${index}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    } catch (error) {
      console.error('Failed to scroll to timeline item:', error);
    }
  }, []);

  const navigateTimeline = useCallback((direction: 'up' | 'down') => {
    setActiveIndex(prev => {
      const nextIndex = direction === 'up' 
        ? Math.max(0, prev - 1)
        : Math.min(itemsCount - 1, prev + 1);
      
      if (nextIndex !== prev) {
        scrollToItem(nextIndex);
      }
      
      return nextIndex;
    });
  }, [itemsCount, scrollToItem]);

  const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
      scrollToItem(activeIndex - 1);
    } else if (e.key === 'ArrowDown' && activeIndex < itemsCount - 1) {
      setActiveIndex(prev => prev + 1);
      scrollToItem(activeIndex + 1);
    }
  }, [activeIndex, itemsCount, scrollToItem]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  return {
    activeIndex,
    setActiveIndex,
    navigateTimeline,
    handleKeyNavigation,
    scrollToItem
  };
};