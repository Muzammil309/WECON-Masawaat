import { HeroSection } from '@/components/aivent/hero-section'
import { AboutSection } from '@/components/aivent/about-section'
import { MarqueeSection } from '@/components/aivent/marquee-section'
import { WhyAttendSection } from '@/components/aivent/why-attend-section'
import { SpeakersSection } from '@/components/aivent/speakers-section'
import { TicketsSection } from '@/components/aivent/tickets-section'

export default function Home() {
  return (
    <div id="wrapper" className="aivent-theme dark-scheme">
      {/* Page preloader */}
      <div id="de-loader"></div>

      {/* Float text and scrollbar */}
      <div className="float-text show-on-scroll">
        <span><a href="#">Scroll to top</a></span>
      </div>
      <div className="scrollbar-v show-on-scroll"></div>

      <HeroSection />
      <AboutSection />
      <MarqueeSection />
      <WhyAttendSection />
      <SpeakersSection />
      <TicketsSection />
    </div>
  );
}
