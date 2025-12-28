import { useEffect } from 'react';

export default function Oneko() {
  useEffect(() => {
    // Check if oneko is already loaded
    if (document.getElementById('oneko')) {
      return;
    }

    // Load the oneko script
    const script = document.createElement('script');
    script.src = '/oneko/oneko.js';
    script.setAttribute('data-cat', '/oneko/oneko.gif');
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Remove the script
      const existingScript = document.querySelector('script[src="/oneko/oneko.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      // Remove the cat and tooltip elements
      const nekoEl = document.getElementById('oneko');
      if (nekoEl) {
        document.body.removeChild(nekoEl);
      }
      
      const tooltipEl = document.getElementById('oneko-tooltip');
      if (tooltipEl) {
        document.body.removeChild(tooltipEl);
      }
    };
  }, []);

  return null;
}