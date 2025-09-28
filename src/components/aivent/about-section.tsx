'use client'

import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="section-about" className="bg-dark section-dark text-light">
      <div className="container">
        <div className="row  gx-5 align-items-center justify-content-between">
          <div className="col-lg-6">
              <div className="me-lg-5 pe-lg-5 py-5 my-5">
              <div className="subtitle animate-fade-in-up" data-wow-delay=".2s">
                About the Event
              </div>
              <h2 className="wow fadeInUp" data-wow-delay=".4s">A Global Gathering of AI Innovators</h2>
              <p className="wow fadeInUp" data-wow-delay=".6s">Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future
              of work.</p>

              <ul className="ul-check">
                  <li className="wow fadeInUp" data-wow-delay=".8s">5 days of keynotes, workshops, and networking</li>
                  <li className="wow fadeInUp" data-wow-delay=".9s">50 world-class speakers</li>
                  <li className="wow fadeInUp" data-wow-delay="1s">Startup showcase and live demos</li>
              </ul>

          </div>
    </div>

    <div className="col-lg-5">
        <div className="wow scaleIn">
            <img src="/aivent/images/misc/c1.webp" className="w-100 rotate-animation" alt="" />
        </div>
    </div>

</div>
</div>
    </section>
  )
}

// Add rotation animation to global CSS
const rotationStyles = `
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .rotate-animation {
    animation: rotate 20s linear infinite;
  }
  
  .animate-fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.6s ease forwards;
  }
  
  .animate-scale-in {
    opacity: 0;
    transform: scale(0.8);
    animation: scaleIn 0.8s ease forwards;
  }
  
  .animation-delay-200 {
    animation-delay: 0.2s;
  }
  
  .animation-delay-400 {
    animation-delay: 0.4s;
  }
  
  .animation-delay-600 {
    animation-delay: 0.6s;
  }
  
  .animation-delay-800 {
    animation-delay: 0.8s;
  }
  
  .animation-delay-1000 {
    animation-delay: 1s;
  }
  
  .animation-delay-1200 {
    animation-delay: 1.2s;
  }
`

// This will be added to the global CSS file
