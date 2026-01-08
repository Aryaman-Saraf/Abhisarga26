import { useState, useEffect } from 'react';

export const useActiveCard = (containerRef, cardRefs, totalCards) => {
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

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef, cardRefs, totalCards]);

  return activeIndex;
};

