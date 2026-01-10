"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TimelineCard } from './TimelineCard';
import { TimelineConnector } from './TimelineConnector';
import { FogOverlay } from './FogOverlay';
import { useActiveCard } from './hooks/useActiveCard';
const ghosttImage = '/ghostt.png';

export const EventTimeline = ({ events, className = '' }) => {
  // Early return if no events
  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen bg-[#030204] flex items-center justify-center">
        <div className="text-white text-xl">Loading Event Timeline...</div>
      </div>
    );
  }

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleStart, setVisibleStart] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const windowSize = 7;

  const maxStart = Math.max(events.length - windowSize, 0);
  const canGoPrev = visibleStart > 0;
  const canGoNext = visibleStart < maxStart;

  const visibleEvents = events.slice(visibleStart, visibleStart + windowSize);

  // Get unique dates from all events
  const uniqueDates = [...new Set(events.map(event => event.date))];

  // Motion value for horizontal position
  const x = useMotionValue(0);

  // Motion value for scrollbar handle
  const handleX = useMotionValue(0);
  const [isDraggingScrollbar, setIsDraggingScrollbar] = useState(false);

  // Calculate dynamic scrollbar dimensions based on number of cards
  const cardsPerScrollbarUnit = 1; // Each card gets 1 unit of scrollbar space
  const scrollbarWidth = Math.max(320, events.length * 60); // Minimum 320px, 60px per card
  const handleWidthPercent = Math.max(10, Math.min(25, 100 / Math.max(1, events.length))); // Handle width as percentage
  const maxHandlePosition = scrollbarWidth - (scrollbarWidth * handleWidthPercent / 100);

  // Sync handle position with timeline position
  useEffect(() => {
    if (scrollDistance === 0) return; // Avoid division by zero

    const unsubscribeX = x.onChange((value) => {
      if (isDraggingScrollbar) return; // Don't update handle while dragging
      // Convert current card index to handle position (0 to maxHandlePosition)
      const totalCards = events.length;
      const progress = selectedIndex / (totalCards - 1);
      handleX.set(Math.max(0, Math.min(maxHandlePosition, progress * maxHandlePosition)));
    });

    const unsubscribeHandle = handleX.onChange((value) => {
      if (!isDraggingScrollbar) return; // Only update x while dragging

      // Direct card-based mapping: each position on scrollbar corresponds to a card
      const totalCards = events.length;
      const cardIndex = Math.round((value / maxHandlePosition) * (totalCards - 1));

      // Ensure card index is within bounds
      const clampedIndex = Math.max(0, Math.min(totalCards - 1, cardIndex));
      setSelectedIndex(clampedIndex);

      // Update selected date to match the selected card
      if (events[clampedIndex]) {
        setSelectedDate(events[clampedIndex].date);
      }

      // Calculate position to center the selected card
      if (scrollDistance < 0) {
        // Calculate proportional position: card index determines how far to scroll
        const progress = clampedIndex / (events.length - 1);
        const targetX = scrollDistance * progress;
        x.set(targetX);
      }
    });

    return () => {
      unsubscribeX();
      unsubscribeHandle();
    };
  }, [x, handleX, scrollDistance, isDraggingScrollbar, maxHandlePosition, events.length, selectedIndex]);

  // Get active card based on center position (card visually in front)
  const activeIndex = useActiveCard(cardRefs, events.length, x);

  // Initialize selectedDate to the first event's date
  useEffect(() => {
    if (events.length > 0 && selectedDate === null) {
      setSelectedDate(events[0].date);
    }
  }, [events, selectedDate]);

  // Keep selectedIndex in sync with whichever card is visually in front
  useEffect(() => {
    if (!events.length) return;
    setSelectedIndex(activeIndex);

    // Update selected date to match the active card
    if (events[activeIndex]) {
      setSelectedDate(events[activeIndex].date);
    }
  }, [activeIndex, events]);

  const handleJumpToIndex = (index) => {
    if (!events.length) return;

    // Update selected index immediately for highlight / timeline window
    setSelectedIndex(index);

    // On mobile, scroll directly to the card
    if (isMobile && cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    // On desktop, animate the timeline to center that card
    if (scrollDistance < 0) {
      // Calculate proportional position: card index determines how far to scroll
      const progress = index / (events.length - 1);
      const targetX = scrollDistance * progress;
      x.set(targetX);
    }
  };

  const handleJumpToDate = (date) => {
    // Set the selected date
    setSelectedDate(date);

    // Find the first event with this date
    const firstEventIndex = events.findIndex(event => event.date === date);
    if (firstEventIndex !== -1) {
      handleJumpToIndex(firstEventIndex);

      // Immediately sync the scrollbar handle to the selected date's position
      const totalCards = events.length;
      const progress = firstEventIndex / (totalCards - 1);
      handleX.set(Math.max(0, Math.min(maxHandlePosition, progress * maxHandlePosition)));
    }
  };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keep active event within the visible date window
  useEffect(() => {
    if (!events.length) return;

    if (selectedIndex < visibleStart) {
      setVisibleStart(selectedIndex);
    } else if (selectedIndex >= visibleStart + windowSize) {
      const newStart = Math.min(selectedIndex - windowSize + 1, maxStart);
      setVisibleStart(newStart);
    }
  }, [selectedIndex, events.length, maxStart, visibleStart]);

  // Handle drag start
  const handleMouseDown = (e) => {
    if (!isHoveringTimeline) return;

    setIsDragging(true);
    setDragStart(e.clientX);
    setIsGrabbing(true);

    // Add global mouse event listeners for drag
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle drag movement
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart;
    const currentX = x.get();
    const newX = Math.max(scrollDistance, Math.min(0, currentX + deltaX));

    x.set(newX);
    setDragStart(e.clientX);
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsGrabbing(false);

    // Remove global mouse event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Prevent wheel events when hovering (allow normal vertical scroll)
  const handleWheel = (e) => {
    if (isHoveringTimeline) {
      e.preventDefault(); // Prevent any scroll behavior when hovering
    }
    // If not hovering, allow normal vertical scroll
  };

  // Calculate the horizontal scroll distance
  useEffect(() => {
    if (!trackRef.current || isMobile) return;
    
    const calculateDistance = () => {
      const trackWidth = trackRef.current?.scrollWidth || 0;
      const viewportWidth = window.innerWidth;
      setScrollDistance(-(trackWidth - viewportWidth + 100));
    };

    calculateDistance();
    window.addEventListener('resize', calculateDistance);
    return () => window.removeEventListener('resize', calculateDistance);
  }, [events.length, isMobile]);

  // Smooth spring for horizontal movement with enhanced fluidity
  const smoothX = useSpring(x, {
    stiffness: 120,
    damping: 25,
    mass: 0.8,
    restDelta: 0.001,
  });

  // Mobile vertical layout
  if (isMobile) {
    return (
      <div className={`relative min-h-screen bg-[#030204] st-noise ${className}`}>
        <FogOverlay />
        
        {/* Header */}
        <div className="relative z-20 pt-16 pb-8 px-6 text-center space-y-4">
          <motion.h1
            className="st-title text-2xl md:text-3xl font-bold mb-3 text-white st-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Schedule
          </motion.h1>
          <motion.p
            className="text-white/60 text-sm max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Scroll through dates or tap to jump to an event
          </motion.p>

          {/* Date timeline bar - all unique dates */}
          <motion.div
            className="mt-2 pb-2 flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-black/60 px-3 py-2 max-w-full overflow-x-auto">
              {uniqueDates.map((date) => {
                const isSelected = selectedDate === date;
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => handleJumpToDate(date)}
                    className={`relative rounded-full px-3 py-1 text-[0.7rem] md:text-xs uppercase tracking-[0.18em] transition-colors whitespace-nowrap flex-shrink-0 ${
                      isSelected
                        ? 'bg-red-500 text-black'
                        : 'bg-black/40 text-white/70 hover:bg-red-500/20 hover:text-white'
                    }`}
                  >
                    {date}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative z-20 px-6 pb-20">
          <div className="relative max-w-lg mx-auto">
            {/* Vertical connector line */}
            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500/60 via-red-500/40 to-red-500/20 st-line-glow" />
            
            <div className="space-y-8">
              {events.map((event, index) => (
                <div key={event.id} className="relative pl-12">
                  {/* Dot */}
                  <div className="absolute left-2 top-8 w-5 h-5 rounded-full bg-red-500 st-dot-pulse">
                    <div className="absolute inset-1 rounded-full bg-white/30" />
                  </div>
                  
                  <TimelineCard
                    ref={(el) => (cardRefs.current[index] = el)}
                    event={event}
                    index={index}
                    isActive={index === activeIndex}
                    isPast={index < activeIndex}
                    isFuture={index > activeIndex}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop horizontal layout
  return (
    <motion.div
      ref={containerRef}
      className={`relative min-h-screen bg-[#030204] st-noise ${className}`}
      style={{ position: 'relative' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <FogOverlay />
      
      {/* Sticky container */}
      <div
        className="relative h-screen overflow-hidden flex flex-col justify-center select-none"
        onMouseEnter={() => setIsHoveringTimeline(true)}
        onMouseLeave={() => {
          setIsHoveringTimeline(false);
          if (isDragging) {
            handleMouseUp(); // Clean up if mouse leaves while dragging
          }
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Header */}
        <div className="relative z-20 text-center mb-8 px-6 space-y-4">
          <motion.h1
            className="st-title text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white st-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Schedule
          </motion.h1>
          

          {/* Date timeline bar - all unique dates */}
          <motion.div
            className="mt-6 pb-4 flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/40 bg-black/60 px-4 py-2 max-w-full overflow-x-auto">
              {uniqueDates.map((date) => {
                const isSelected = selectedDate === date;
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => handleJumpToDate(date)}
                    className={`relative rounded-full px-4 py-1 text-xs md:text-sm uppercase tracking-[0.22em] transition-colors whitespace-nowrap flex-shrink-0 ${
                      isSelected
                        ? 'bg-red-500 text-black scale-110'
                        : 'bg-black/40 text-white/70 hover:bg-red-500/20 hover:text-white'
                    }`}
                  >
                    {date}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Horizontal scrolling track */}
        <motion.div
          ref={trackRef}
          className="relative z-20 flex items-center gap-4 px-[50vw]"
          style={{ x: smoothX, position: 'relative', transform: 'translateZ(0)' }}
        >
          {events.map((event, index) => (
            <div key={event.id} className="flex items-center">
              <TimelineConnector
                index={index}
                isActive={index === activeIndex}
                isPast={index < selectedIndex}
                isLast={index === events.length - 1}
              />
              <TimelineCard
                ref={(el) => (cardRefs.current[index] = el)}
                event={event}
                index={index}
                isActive={index === activeIndex}
                isPast={index < selectedIndex}
                isFuture={index > selectedIndex}
              />
            </div>
          ))}
        </motion.div>

        {/* Horizontal Scrollbar */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-4 px-6 py-3 rounded-full border border-red-500/40 bg-black/80 backdrop-blur-sm">
            {/* Left Scroll Button */}
            <button
              type="button"
              onClick={() => {
                const currentX = x.get();
                const newX = Math.max(scrollDistance, currentX + 200); // Scroll left (positive = right movement)
                x.set(newX);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-red-500/40 bg-black/60 hover:bg-red-500/20 transition-all hover:scale-110 text-red-400 text-lg font-bold"
              aria-label="Scroll timeline left"
            >
              ‹
            </button>

            {/* Scrollbar Track */}
            <div
              className="relative h-2 bg-black/40 rounded-full overflow-hidden"
              style={{ width: `${scrollbarWidth}px` }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500/60 to-red-600 rounded-full cursor-pointer"
                style={{
                  width: `${handleWidthPercent}%`,
                  x: handleX
                }}
                drag="x"
                dragConstraints={{ left: 0, right: maxHandlePosition }}
                dragElastic={0}
                dragMomentum={false}
                whileDrag={{ scale: 1.1 }}
                onDragStart={() => setIsDraggingScrollbar(true)}
                onDragEnd={() => setIsDraggingScrollbar(false)}
              />
            </div>

            {/* Right Scroll Button */}
            <button
              type="button"
              onClick={() => {
                const currentX = x.get();
                const newX = Math.max(scrollDistance, currentX - 200); // Scroll right (negative = left movement)
                x.set(newX);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-red-500/40 bg-black/60 hover:bg-red-500/20 transition-all hover:scale-110 text-red-400 text-lg font-bold"
              aria-label="Scroll timeline right"
            >
              ›
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventTimeline;

