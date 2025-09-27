import { HeroSection } from '@/components/aivent/hero-section'
import { AboutSection } from '@/components/aivent/about-section'
import { MarqueeSection } from '@/components/aivent/marquee-section'
import { WhyAttendSection } from '@/components/aivent/why-attend-section'
import { SpeakersSection } from '@/components/aivent/speakers-section'
import { TicketsSection } from '@/components/aivent/tickets-section'

export default function Home() {
  return (
    <div className="aivent-theme dark-scheme">
      <HeroSection />
      <AboutSection />
      <MarqueeSection />
      <WhyAttendSection />
      <SpeakersSection />
      <TicketsSection />
    </div>
  );
}
