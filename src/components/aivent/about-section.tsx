'use client'

import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="section-about" className="bg-dark section-dark text-light py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="lg:pr-12">
            <div className="py-5 my-5">
              <div className="subtitle animate-fade-in-up" data-wow-delay=".2s">
                About the Event
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in-up" data-wow-delay=".4s">
                A Global Gathering of Tech Innovators
              </h2>
              <p className="text-lg mb-8 opacity-90 animate-fade-in-up" data-wow-delay=".6s">
                Join thought leaders, developers, researchers, and founders as we explore how technology 
                is reshaping industries, creativity, and the future of work. WECON brings together the 
                brightest minds to share insights, innovations, and opportunities.
              </p>

              <ul className="ul-check space-y-4">
                <li className="flex items-center animate-fade-in-up" data-wow-delay=".8s">
                  <CheckCircle className="w-6 h-6 id-color mr-4 flex-shrink-0" />
                  <span className="text-lg">5 days of keynotes, workshops, and networking</span>
                </li>
                <li className="flex items-center animate-fade-in-up" data-wow-delay=".9s">
                  <CheckCircle className="w-6 h-6 id-color mr-4 flex-shrink-0" />
                  <span className="text-lg">100+ world-class speakers and industry experts</span>
                </li>
                <li className="flex items-center animate-fade-in-up" data-wow-delay="1s">
                  <CheckCircle className="w-6 h-6 id-color mr-4 flex-shrink-0" />
                  <span className="text-lg">Startup showcase and live product demos</span>
                </li>
                <li className="flex items-center animate-fade-in-up" data-wow-delay="1.1s">
                  <CheckCircle className="w-6 h-6 id-color mr-4 flex-shrink-0" />
                  <span className="text-lg">Exclusive networking opportunities</span>
                </li>
                <li className="flex items-center animate-fade-in-up" data-wow-delay="1.2s">
                  <CheckCircle className="w-6 h-6 id-color mr-4 flex-shrink-0" />
                  <span className="text-lg">Hands-on technical workshops</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <Image
                src="/aivent/images/misc/c1.webp"
                alt="WECON Summit Innovation"
                width={500}
                height={500}
                className="relative z-10 w-full max-w-md h-auto rotate-animation"
                priority
              />
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
