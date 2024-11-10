import { useEffect, useRef, useState } from 'react';
import { TimelineItemType } from '@/types/timeline';
import { debounce } from 'lodash';

interface UseTimelineScrollProps {
  timelineItems: TimelineItemType[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  isWheelNavigating?: boolean;
}

export const useTimelineScroll = ({
  timelineItems,
  setActiveIndex,
  isWheelNavigating = false,
}: Omit<UseTimelineScrollProps, 'activeIndex'>) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observers = observersRef.current;

    const cleanup = () => {
      observers.forEach(observer => observer.disconnect());
      observers.clear();
    };

    cleanup();

    if (!isWheelNavigating) {
      timelineItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isScrolling) {
              setActiveIndex(index);
            }
          });
        }, options);

        const elementId = `timeline-item-${index}`;
        const element = document.getElementById(elementId);
        if (element) {
          observer.observe(element);
          observers.set(elementId, observer);
        }
      });
    }

    return cleanup;
  }, [timelineItems, setActiveIndex, isScrolling, isWheelNavigating]);

    const handleScroll = useRef(
      debounce(() => {
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 100);
      }, 50)
    ).current;

    useEffect(() => {
      const debouncedScroll = handleScroll;
      const observers = observersRef.current;

      return () => {
        debouncedScroll.cancel();
        observers.forEach(observer => observer.disconnect());
        observers.clear();
      };
    }, [handleScroll]);

    return { isScrolling, handleScroll };
};