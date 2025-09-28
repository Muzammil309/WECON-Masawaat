'use client'

import { useEffect } from 'react'

// Declare global jQuery types
declare global {
  interface Window {
    $: any;
  }
}

export function MarqueeSection() {
  useEffect(() => {
    // Initialize marquee animations when component mounts
    const initializeMarquee = () => {
      if (typeof window !== 'undefined' && window.$ && window.$.fn.marquee) {
        try {
          // Clear any existing marquee instances
          window.$('.de-marquee-list-1').marquee('destroy');
          window.$('.de-marquee-list-2').marquee('destroy');
        } catch (e) {
          // Ignore errors if marquee wasn't initialized yet
        }

        // Initialize marquee with exact original settings from custom-marquee.js
        window.$('.de-marquee-list-1').marquee({
          direction: 'right',
          duration: 60000,  // Exact 60 second duration from original
          gap: 0,
          delayBeforeStart: 0,
          duplicated: true,
          startVisible: true
        });

        window.$('.de-marquee-list-2').marquee({
          direction: 'left',
          duration: 60000,  // Exact 60 second duration from original
          gap: 0,
          delayBeforeStart: 0,
          duplicated: true,
          startVisible: true
        });

        console.log('Marquee animations initialized with 60s duration');
      } else {
        // Retry if jQuery or marquee plugin not ready
        setTimeout(initializeMarquee, 100);
      }
    };

    // Initialize immediately if scripts are ready, otherwise wait
    if (typeof window !== 'undefined' && window.$ && window.$.fn.marquee) {
      initializeMarquee();
    } else {
      // Wait for scripts to load with shorter intervals for faster initialization
      const timer = setTimeout(initializeMarquee, 1000);
      return () => clearTimeout(timer);
    }

    return () => {
      // Clean up marquee instances on unmount
      if (typeof window !== 'undefined' && window.$ && window.$.fn.marquee) {
        try {
          window.$('.de-marquee-list-1').marquee('destroy');
          window.$('.de-marquee-list-2').marquee('destroy');
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <section id="section-marquee" className="section-dark p-0" aria-label="section">
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
