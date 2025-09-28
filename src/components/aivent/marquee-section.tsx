'use client'

import { useEffect } from 'react'

// Declare global jQuery types for marquee plugin
declare global {
  interface Window {
    $: {
      (selector: string): {
        marquee: (options: {
          direction: string;
          duration: number;
          gap: number;
          delayBeforeStart: number;
          duplicated: boolean;
          startVisible: boolean;
        } | string) => void;
        length: number;
      };
      fn: {
        marquee?: unknown;
      };
    };
  }
}

export function MarqueeSection() {
  useEffect(() => {
    // Simple initialization that matches the original custom-marquee.js exactly
    const initializeMarquee = () => {
      if (typeof window !== 'undefined' && window.$ && window.$.fn.marquee) {
        // Initialize marquee with exact original settings
        window.$('.de-marquee-list-1').marquee({
          direction: 'right',
          duration: 60000,
          gap: 0,
          delayBeforeStart: 0,
          duplicated: true,
          startVisible: true
        });

        window.$('.de-marquee-list-2').marquee({
          direction: 'left',
          duration: 60000,
          gap: 0,
          delayBeforeStart: 0,
          duplicated: true,
          startVisible: true
        });

        console.log('Marquee animations initialized successfully');
      } else {
        // Retry if jQuery or marquee plugin not ready
        setTimeout(initializeMarquee, 500);
      }
    };

    // Start initialization after a short delay to ensure DOM is ready
    setTimeout(initializeMarquee, 100);

    return () => {
      // Clean up marquee instances on unmount
      if (typeof window !== 'undefined' && window.$ && window.$.fn.marquee) {
        try {
          window.$('.de-marquee-list-1').marquee('destroy');
          window.$('.de-marquee-list-2').marquee('destroy');
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <section className="section-dark p-0" aria-label="section">
      <div className="bg-color text-light d-flex py-4 lh-1 rot-2">
        <div className="de-marquee-list-1 wow fadeInLeft" data-wow-duration="3s">
          <span className="fs-60 mx-3">Next Intelligence</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Future Now</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Empowering Innovation</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Smarter Tomorrow</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Think Forward</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Cognitive Shift</span>
          <span className="fs-60 mx-3 op-2">/</span>
        </div>
      </div>

      <div className="bg-color-2 text-light d-flex py-4 lh-1 rot-min-1 mt-min-20">
        <div className="de-marquee-list-2 wow fadeInRight" data-wow-duration="3s">
          <span className="fs-60 mx-3">Next Intelligence</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Future Now</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Empowering Innovation</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Smarter Tomorrow</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Think Forward</span>
          <span className="fs-60 mx-3 op-2">/</span>
          <span className="fs-60 mx-3">Cognitive Shift</span>
          <span className="fs-60 mx-3 op-2">/</span>
        </div>
      </div>
    </section>
  )
}
