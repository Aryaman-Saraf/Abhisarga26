'use client'

import { useEffect } from 'react';

export default function Oneko() {
  useEffect(() => {
    // Avoid double injection (React Strict Mode, fast refresh, route changes)
    if (typeof window === 'undefined') return;
    
    // Check if already loaded
    if (window.__onekoLoaded) return;
    const existingOneko = document.getElementById('oneko');
    if (existingOneko) return;

    window.__onekoLoaded = true;

    const script = document.createElement('script');
    script.src = '/oneko/oneko.js';
    script.setAttribute('data-cat', '/oneko/oneko.gif');
    script.id = 'oneko-script';
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Small delay to ensure script cleanup happens after React's cleanup
      setTimeout(() => {
        try {
          // Remove oneko elements if they exist and still have parents
          const onekoEl = document.getElementById('oneko');
          const tooltipEl = document.getElementById('oneko-tooltip');
          const onekoScript = document.getElementById('oneko-script');
          
          if (onekoEl?.parentNode) {
            onekoEl.parentNode.removeChild(onekoEl);
          }
          if (tooltipEl?.parentNode) {
            tooltipEl.parentNode.removeChild(tooltipEl);
          }
          if (onekoScript?.parentNode) {
            onekoScript.parentNode.removeChild(onekoScript);
          }
          
          window.__onekoLoaded = false;
        } catch (error) {
          // Silently handle any cleanup errors
          console.debug('Oneko cleanup:', error);
        }
      }, 0);
    };
  }, []);

  return null;
}