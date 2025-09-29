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

  // Set target date for countdown (WECON MASAWAAT 2025)
  const targetDate = new Date('2025-11-26T09:00:00')

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
        <div className="container wow scaleIn" data-wow-duration="3s">
          <div className="row">
            <div className="col-lg-12 text-center">
            <div className="subtitle animate-fade-in-up">The Future of Intelligence</div>
            <h1 className="fs-100 text-uppercase fs-sm-10vw mb-4 lh-1">WECON MASAWAAT 2025</h1>

            <div className="d-block d-md-flex justify-content-center">
              <div className="d-flex justify-content-center align-items-center mx-4">
                <i className="fa fa-calendar id-color me-3"></i>
                <h4 className="mb-0">November 26, 2025</h4>
              </div>

              <div className="d-flex justify-content-center align-items-center mx-4">
                <i className="fa fa-location-pin id-color me-3"></i>
                <h4 className="mb-0">Islamabad, Pakistan</h4>
              </div>
            </div>

            <div className="spacer-single"></div>

            <a className="btn-main mx-2 fx-slide" href="#section-tickets">
              <span>Get Tickets</span>
            </a>
            <a className="btn-main btn-line mx-2 fx-slide" href="#section-schedule">
              <span>View Schedule</span>
            </a>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Countdown Section */}
      <div className="abs w-100 start-0 bottom-0 z-3">
        <div className="container">
          <div className="sm-hide border-white-op-3 p-40 py-4 rounded-1 bg-blur relative overflow-hidden wow fadeInUp">
            <div className="gradient-edge-bottom color start-0 h-50 op-5"></div>
            <div className="row g-4 justify-content-between align-items-center relative z-2">
              <div className="col-lg-3">
                <h2 className="mb-0">Hurry Up!</h2>
                <h4 className="mb-0">Book Your Seat Now</h4>
              </div>
              <div className="col-lg-4">
                <div id="defaultCountdown" className="pt-2">
                  <Countdown targetDate={targetDate} />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="d-flex">
                  <i className="fs-60 icofont-google-map id-color"></i>
                  <div className="ms-3">
                    <h4 className="mb-0">Convention Center,<br />Islamabad, Pakistan</h4>
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
