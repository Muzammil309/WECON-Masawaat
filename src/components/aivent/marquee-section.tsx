'use client'

import { useEffect, useRef } from 'react'

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
        each: (callback: (index: number, element: Element) => void) => void;
      };
      fn: {
        marquee?: unknown;
      };
    };
  }
}

export function MarqueeSection() {
  const marqueeInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (marqueeInitialized.current) return;

    const initializeMarquee = () => {
      if (typeof window !== 'undefined' && window.$ && window.$.fn.marquee) {
        try {
          // Clean up any existing marquee instances first
          const marquee1 = window.$('.de-marquee-list-1');
          const marquee2 = window.$('.de-marquee-list-2');

          // Destroy existing instances if they exist
          try {
            marquee1.marquee('destroy');
            marquee2.marquee('destroy');
          } catch {
            // Ignore if not initialized yet
          }

          // Wait a moment for cleanup, then initialize fresh
          setTimeout(() => {
            // Initialize marquee 1 (right direction)
            if (marquee1.length > 0) {
              marquee1.marquee({
                direction: 'right',
                duration: 60000,
                gap: 0,
                delayBeforeStart: 0,
                duplicated: true,
                startVisible: true
              });
              console.log('Marquee 1 initialized (right direction)');
            }

            // Initialize marquee 2 (left direction)
            if (marquee2.length > 0) {
              marquee2.marquee({
                direction: 'left',
                duration: 60000,
                gap: 0,
                delayBeforeStart: 0,
                duplicated: true,
                startVisible: true
              });
              console.log('Marquee 2 initialized (left direction)');
            }

            marqueeInitialized.current = true;
            console.log('Both marquee animations initialized successfully');
          }, 100);

        } catch (error) {
          console.error('Error initializing marquee:', error);
          // Retry after a delay
          setTimeout(initializeMarquee, 1000);
        }
      } else {
        // Retry if jQuery or marquee plugin not ready
        console.log('jQuery or marquee plugin not ready, retrying...');
        setTimeout(initializeMarquee, 500);
      }
    };

    // Start initialization after DOM is ready
    const timer = setTimeout(initializeMarquee, 200);

    return () => {
      clearTimeout(timer);
      // Clean up marquee instances on unmount
      if (typeof window !== 'undefined' && window.$ && window.$.fn.marquee) {
        try {
          window.$('.de-marquee-list-1').marquee('destroy');
          window.$('.de-marquee-list-2').marquee('destroy');
          marqueeInitialized.current = false;
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
