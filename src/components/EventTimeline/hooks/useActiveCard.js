"use client";

import { useState, useEffect } from 'react';

export const useActiveCard = (containerRef, cardRefs, totalCards, xMotionValue = null) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateActiveCard = () => {
      if (!containerRef.current || !cardRefs.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenterX - centerX);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    // Initial check
    updateActiveCard();

    // Use requestAnimationFrame for smoother updates
    let rafId;
    const handleScroll = () => {
      rafId = requestAnimationFrame(updateActiveCard);
    };

    // Listen for window scroll (for vertical scrolling)
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Listen for motion value changes (for horizontal timeline scrolling)
    let unsubscribeMotion = null;
    let motionRafId = null;
    if (xMotionValue) {
      unsubscribeMotion = xMotionValue.onChange(() => {
        // Use requestAnimationFrame to throttle updates
        if (!motionRafId) {
          motionRafId = requestAnimationFrame(() => {
            updateActiveCard();
            motionRafId = null;
          });
        }
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (motionRafId) cancelAnimationFrame(motionRafId);
      if (unsubscribeMotion) unsubscribeMotion();
    };
  }, [containerRef, cardRefs, totalCards, xMotionValue]);

  return activeIndex;
};

