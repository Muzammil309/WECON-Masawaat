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

        // Wait a moment for DOM to be ready
        setTimeout(() => {
          // Initialize marquee with exact original settings from custom-marquee.js
          const marquee1 = window.$('.de-marquee-list-1');
          const marquee2 = window.$('.de-marquee-list-2');

          if (marquee1.length && marquee2.length) {
            marquee1.marquee({
              direction: 'right',
              duration: 60000,  // Exact 60 second duration from original
              gap: 0,
              delayBeforeStart: 0,
              duplicated: true,
              startVisible: true
            });

            marquee2.marquee({
              direction: 'left',
              duration: 60000,  // Exact 60 second duration from original
              gap: 0,
              delayBeforeStart: 0,
              duplicated: true,
              startVisible: true
            });

            console.log('Dual marquee animations initialized successfully');
            console.log('Marquee 1 direction: right, Marquee 2 direction: left');
          } else {
            console.warn('Marquee elements not found, retrying...');
            setTimeout(initializeMarquee, 500);
          }
        }, 100);
      } else {
        // Retry if jQuery or marquee plugin not ready
        console.log('jQuery or marquee plugin not ready, retrying...');
        setTimeout(initializeMarquee, 200);
      }
    };

    // Initialize with multiple retry attempts
    const initWithRetry = () => {
      let attempts = 0;
      const maxAttempts = 10;

      const tryInit = () => {
        attempts++;
        if (typeof window !== 'undefined' && window.$ && window.$.fn.marquee) {
          initializeMarquee();
        } else if (attempts < maxAttempts) {
          setTimeout(tryInit, 500);
        } else {
          console.error('Failed to initialize marquee after', maxAttempts, 'attempts');
        }
      };

      tryInit();
    };

    // Start initialization
    initWithRetry();

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
      {/* First Marquee - Moving Right with Primary Color Background */}
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

      {/* Second Marquee - Moving Left with Secondary Color Background */}
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
