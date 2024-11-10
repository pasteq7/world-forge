import { useEffect } from 'react';
import { throttle } from 'lodash';

interface UseTimelineWheelProps {
  timelineRef: React.RefObject<HTMLDivElement>;
  navigateTimeline: (direction: 'up' | 'down') => void;
  onWheelStart?: () => void;
  onWheelEnd?: () => void;
}

export const useTimelineWheel = ({ 
  timelineRef, 
  navigateTimeline,
  onWheelStart,
  onWheelEnd,
}: UseTimelineWheelProps) => {
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;

    const handleWheel = throttle((e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 30) {
        onWheelStart?.();
        navigateTimeline(e.deltaY > 0 ? 'down' : 'up');
        
        // Clear any existing timeout
        clearTimeout(wheelTimeout);
        
        // Set a new timeout to indicate wheel navigation has ended
        wheelTimeout = setTimeout(() => {
          onWheelEnd?.();
        }, 150);
      }
    }, 500, { leading: true, trailing: false });

    const timeline = timelineRef.current;
    if (timeline) {
      timeline.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (timeline) {
        timeline.removeEventListener('wheel', handleWheel);
      }
      handleWheel.cancel();
      clearTimeout(wheelTimeout);
    };
  }, [navigateTimeline, timelineRef, onWheelStart, onWheelEnd]);
}; 