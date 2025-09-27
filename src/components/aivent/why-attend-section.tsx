'use client'

import Image from 'next/image'

interface FeatureCardProps {
  title: string
  description: string
  imageSrc: string
  delay?: string
}

function FeatureCard({ title, description, imageSrc, delay = "0s" }: FeatureCardProps) {
  return (
    <div className="hover group">
      <div 
        className="bg-dark-2 relative rounded-1 overflow-hidden hover-bg-color hover-text-light transition-all duration-300 h-full animate-scale-in-mask"
        style={{ animationDelay: delay }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-40 z-2">
          <div className="relative">
            <h4 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
              {title}
            </h4>
            <p className="mb-0 opacity-90 group-hover:text-white transition-colors">
              {description}
            </p>
          </div>
        </div>
        <div className="gradient-edge-bottom h-100"></div>
        <Image
          src={imageSrc}
          alt={title}
          width={400}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-t from-purple-600/0 to-purple-600/20 group-hover:from-purple-600/40 group-hover:to-purple-600/60 transition-all duration-300"></div>
      </div>
    </div>
  )
}

export function WhyAttendSection() {
  const features = [
    {
      title: "Cutting-Edge Knowledge",
      description: "Stay ahead of the curve with insights from tech leaders shaping tomorrow's innovations.",
      imageSrc: "/aivent/images/misc/s3.webp"
    },
    {
      title: "Global Networking",
      description: "Connect with industry pioneers, investors, and fellow innovators from around the world.",
      imageSrc: "/aivent/images/misc/s4.webp"
    },
    {
      title: "Hands-On Learning",
      description: "Participate in interactive workshops and get hands-on experience with latest technologies.",
      imageSrc: "/aivent/images/misc/s5.webp"
    },
    {
      title: "Innovation Showcase",
      description: "Discover groundbreaking startups and revolutionary products changing the tech landscape.",
      imageSrc: "/aivent/images/misc/s6.webp"
    },
    {
      title: "Career Opportunities",
      description: "Meet potential employers, partners, and collaborators to advance your career.",
      imageSrc: "/aivent/images/misc/s7.webp"
    },
    {
      title: "Future Insights",
      description: "Get exclusive previews of emerging technologies and future market trends.",
      imageSrc: "/aivent/images/misc/s8.webp"
    }
  ]

  return (
    <section id="section-why-attend" className="bg-dark section-dark text-light py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="subtitle animate-fade-in-up mb-3">Why Attend</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            What You'll Gain
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Hear from global tech pioneers, industry disruptors, and bold thinkers shaping the future across every domain.
          </p>
        </div>

        <div className="spacer-single"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              imageSrc={feature.imageSrc}
              delay={`${index * 0.2}s`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
