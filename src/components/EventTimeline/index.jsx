import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TimelineCard } from './TimelineCard';
import { TimelineConnector } from './TimelineConnector';
import { FogOverlay } from './FogOverlay';
import { useActiveCard } from './hooks/useActiveCard';
import ghosttImage from '../../assets/ghostt.png';

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

  // Motion value for horizontal position
  const x = useMotionValue(0);

  // Get active card based on center position (card visually in front)
  const activeIndex = useActiveCard(containerRef, cardRefs, events.length);

  // Keep selectedIndex in sync with whichever card is visually in front
  useEffect(() => {
    if (!events.length) return;
    setSelectedIndex(activeIndex);
  }, [activeIndex, events.length]);

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
    if (!trackRef.current) return;

    const trackWidth = trackRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const totalScrollableWidth = trackWidth - viewportWidth + 100;

    // Calculate the position to center the selected card
    const cardWidth = 400; // Approximate card width
    const spacing = 16; // Gap between cards
    const cardPosition = index * (cardWidth + spacing);
    const centerOffset = viewportWidth / 2 - cardWidth / 2;

    const targetX = -Math.min(Math.max(0, cardPosition - centerOffset), totalScrollableWidth);

    x.set(targetX);
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

  // Smooth spring for horizontal movement
  const smoothX = useSpring(x, {
    stiffness: 100,
    damping: 30,
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
            className="st-title text-3xl md:text-4xl font-bold text-white st-flicker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Event Timeline
          </motion.h1>
          <motion.p
            className="text-white/60 text-sm max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Scroll through dates or tap to jump to an event
          </motion.p>

          {/* Date timeline bar */}
          <motion.div
            className="mt-2 pb-2 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Prev button */}
            <button
              type="button"
              onClick={() => canGoPrev && setVisibleStart((prev) => Math.max(prev - 1, 0))}
              disabled={!canGoPrev}
              className={`flex items-center justify-center w-8 h-8 rounded-full border text-xs transition-all ${
                canGoPrev
                  ? 'border-red-500/60 text-red-400 hover:bg-red-500/20 hover:scale-105'
                  : 'border-red-500/20 text-red-500/30 cursor-not-allowed'
              }`}
              aria-label="Previous dates"
            >
              ‹
            </button>

            {/* Date pills (max 7) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-black/60 px-3 py-2">
              {visibleEvents.map((event, offsetIndex) => {
                const index = visibleStart + offsetIndex;
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handleJumpToIndex(index)}
                    className={`relative rounded-full px-3 py-1 text-[0.7rem] md:text-xs uppercase tracking-[0.18em] transition-colors whitespace-nowrap ${
                      index === selectedIndex
                        ? 'bg-red-500 text-black'
                        : 'bg-black/40 text-white/70 hover:bg-red-500/20 hover:text-white'
                    }`}
                  >
                    {event.date}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={() => canGoNext && setVisibleStart((prev) => Math.min(prev + 1, maxStart))}
              disabled={!canGoNext}
              className={`flex items-center justify-center w-8 h-8 rounded-full border text-xs transition-all ${
                canGoNext
                  ? 'border-red-500/60 text-red-400 hover:bg-red-500/20 hover:scale-105'
                  : 'border-red-500/20 text-red-500/30 cursor-not-allowed'
              }`}
              aria-label="Next dates"
            >
              ›
            </button>
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
    <div
      ref={containerRef}
      className={`relative min-h-screen bg-[#030204] st-noise ${className}`}
      style={{ position: 'relative' }}
    >
      <FogOverlay />
      
      {/* Sticky container */}
      <div
        className={`relative h-screen overflow-hidden flex flex-col justify-center select-none ${
          isHoveringTimeline ? (isDragging || isGrabbing ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
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
            className="st-title text-4xl md:text-5xl lg:text-6xl font-bold text-white st-flicker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Event Timeline
          </motion.h1>
          <motion.p
            className="text-white/60 text-base md:text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Drag the scrollbar below or use ghost arrows to navigate through events
          </motion.p>

          {/* Date timeline bar with ghost arrows */}
          <motion.div
            className="mt-6 pb-4 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Left Arrow */}
            <button
              type="button"
              onClick={() => canGoPrev && setVisibleStart((prev) => Math.max(prev - 1, 0))}
              disabled={!canGoPrev}
              className={`flex items-center justify-center w-12 h-12 rounded-full border border-red-500/40 bg-black/60 transition-all hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                canGoPrev ? 'hover:scale-110' : ''
              }`}
              aria-label="Scroll dates left"
            >
              <img
                src={ghosttImage}
                alt="Left arrow"
                className="w-6 h-6 transform rotate-180"
              />
            </button>

            {/* Date pills (max 7) */}
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/40 bg-black/60 px-4 py-2">
              {visibleEvents.map((event, offsetIndex) => {
                const index = visibleStart + offsetIndex;
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handleJumpToIndex(index)}
                    className={`relative rounded-full px-4 py-1 text-xs md:text-sm uppercase tracking-[0.22em] transition-colors whitespace-nowrap ${
                      index === selectedIndex
                        ? 'bg-red-500 text-black scale-110'
                        : 'bg-black/40 text-white/70 hover:bg-red-500/20 hover:text-white'
                    }`}
                  >
                    {event.date}
                  </button>
                );
              })}
            </div>

            {/* Right Arrow */}
            <button
              type="button"
              onClick={() => canGoNext && setVisibleStart((prev) => Math.min(prev + 1, maxStart))}
              disabled={!canGoNext}
              className={`flex items-center justify-center w-12 h-12 rounded-full border border-red-500/40 bg-black/60 transition-all hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                canGoNext ? 'hover:scale-110' : ''
              }`}
              aria-label="Scroll dates right"
            >
              <img
                src={ghosttImage}
                alt="Right arrow"
                className="w-6 h-6"
              />
            </button>
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
                isActive={index === selectedIndex}
                isPast={index < selectedIndex}
                isLast={index === events.length - 1}
              />
              <TimelineCard
                ref={(el) => (cardRefs.current[index] = el)}
                event={event}
                index={index}
                isActive={index === selectedIndex}
                isPast={index < selectedIndex}
                isFuture={index > selectedIndex}
              />
            </div>
          ))}
        </motion.div>

        {/* Horizontal Scrollbar */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
              className="flex items-center justify-center w-8 h-8 rounded-full border border-red-500/40 bg-black/60 hover:bg-red-500/20 transition-all hover:scale-110"
              aria-label="Scroll timeline left"
            >
              <img
                src={ghosttImage}
                alt="Scroll left"
                className="w-4 h-4 transform rotate-180"
              />
            </button>

            {/* Scrollbar Track */}
            <div className="relative w-64 h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500/60 to-red-600 rounded-full cursor-pointer"
                style={{
                  width: '20%',
                  x: useTransform(x, [scrollDistance, 0], ['0%', '80%'])
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 204 }} // 80% of 256px (w-64)
                dragElastic={0}
                onDrag={(_, info) => {
                  const trackWidth = 256;
                  const progress = info.point.x / trackWidth;
                  const newX = scrollDistance + (progress * -scrollDistance);
                  x.set(Math.max(scrollDistance, Math.min(0, newX)));
                }}
                whileDrag={{ scale: 1.1 }}
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
              className="flex items-center justify-center w-8 h-8 rounded-full border border-red-500/40 bg-black/60 hover:bg-red-500/20 transition-all hover:scale-110"
              aria-label="Scroll timeline right"
            >
              <img
                src={ghosttImage}
                alt="Scroll right"
                className="w-4 h-4"
              />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventTimeline;

