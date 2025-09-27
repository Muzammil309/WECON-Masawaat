'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CountdownProps {
  targetDate: Date
}

function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="countdown-container">
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.hours}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.minutes}</span>
        <span className="countdown-label">Minutes</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.seconds}</span>
        <span className="countdown-label">Seconds</span>
      </div>
    </div>
  )
}

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setIsVideoLoaded(true)
      })
    }
  }, [])

  // Set target date for countdown (example: 30 days from now)
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 30)

  return (
    <section 
      id="section-hero" 
      className="section-dark no-top no-bottom text-light jarallax relative mh-800 overflow-hidden"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="jarallax-img absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/aivent/videos/2.mp4" type="video/mp4" />
      </video>
      {/* Gradient Overlays */}
      <div className="gradient-edge-top op-6 h-50 color"></div>
      <div className="gradient-edge-bottom"></div>
      <div className="sw-overlay op-8"></div>
      {/* Main Content */}
      <div className="abs abs-centered z-2 w-80">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="subtitle animate-fade-in-up">The Future of Intelligence</div>
            <h1 className="fs-120 text-uppercase fs-sm-12vw mb-4 lh-1 animate-fade-in-up animation-delay-200">
              WECON Summit 2025
            </h1>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
              <div className="flex justify-center items-center">
                <Calendar className="w-6 h-6 id-color mr-3" />
                <h4 className="mb-0 text-xl font-semibold">March 15–19, 2025</h4>
              </div>

              <div className="flex justify-center items-center">
                <MapPin className="w-6 h-6 id-color mr-3" />
                <h4 className="mb-0 text-xl font-semibold">Dubai, UAE</h4>
              </div>
            </div>

            <div className="spacer-single"></div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events" className="btn-main mx-2" legacyBehavior>
                <span>Get Tickets</span>
              </Link>
              <Link href="/events" className="btn-main btn-line mx-2" legacyBehavior>
                <span>View Schedule</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Info Card */}
      <div className="abs w-full start-0 bottom-0 z-3">
        <div className="container mx-auto px-4">
          <div className="sm-hide border-white-op-3 p-40 py-4 rounded-1 bg-blur relative overflow-hidden animate-fade-in-up">
            <div className="gradient-edge-bottom color start-0 h-50 op-5"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center relative z-2">
              <div className="text-center lg:text-left">
                <h2 className="mb-0 text-2xl font-bold">Hurry Up!</h2>
                <h4 className="mb-0 text-lg">Book Your Seat Now</h4>
              </div>
              <div className="flex justify-center">
                <Countdown targetDate={targetDate} />
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="flex items-center">
                  <MapPin className="text-6xl id-color mr-3" />
                  <div>
                    <h4 className="mb-0 text-lg font-semibold">
                      Dubai World Trade Centre,<br />
                      Sheikh Zayed Road, Dubai
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
