'use client'

import Image from 'next/image'
import { Twitter, Linkedin, Globe } from 'lucide-react'

interface SpeakerProps {
  name: string
  title: string
  company: string
  image: string
  bio: string
  social?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
  delay?: string
}

function SpeakerCard({ name, title, company, image, bio, social, delay = "0s" }: SpeakerProps) {
  return (
    <div 
      className="group animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="bg-dark-2 rounded-1 overflow-hidden hover-bg-color hover-text-light transition-all duration-300 h-full">
        <div className="relative">
          <Image
            src={image}
            alt={name}
            width={300}
            height={300}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          {/* Social Links */}
          {social && (
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {social.twitter && (
                <a 
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Twitter className="w-4 h-4 text-white" />
                </a>
              )}
              {social.linkedin && (
                <a 
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-white" />
                </a>
              )}
              {social.website && (
                <a 
                  href={social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Globe className="w-4 h-4 text-white" />
                </a>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h4 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
            {name}
          </h4>
          <div className="text-primary font-semibold mb-1">{title}</div>
          <div className="text-sm opacity-80 mb-3">{company}</div>
          <p className="text-sm opacity-90 group-hover:text-white transition-colors">
            {bio}
          </p>
        </div>
      </div>
    </div>
  )
}

export function SpeakersSection() {
  const speakers = [
    {
      name: "Dr. Sarah Chen",
      title: "Chief AI Officer",
      company: "TechCorp Global",
      image: "/aivent/images/team/1.webp",
      bio: "Leading AI researcher with 15+ years in machine learning and neural networks. Pioneer in ethical AI development.",
      social: {
        twitter: "https://twitter.com/sarahchen",
        linkedin: "https://linkedin.com/in/sarahchen",
        website: "https://sarahchen.ai"
      }
    },
    {
      name: "Marcus Rodriguez",
      title: "Founder & CEO",
      company: "InnovateLab",
      image: "/aivent/images/team/2.webp",
      bio: "Serial entrepreneur and tech visionary. Built 3 successful startups in the AI and blockchain space.",
      social: {
        twitter: "https://twitter.com/marcusrod",
        linkedin: "https://linkedin.com/in/marcusrodriguez"
      }
    },
    {
      name: "Dr. Aisha Patel",
      title: "Head of Research",
      company: "Quantum Dynamics",
      image: "/aivent/images/team/3.webp",
      bio: "Quantum computing expert and published author. Leading breakthrough research in quantum-AI integration.",
      social: {
        linkedin: "https://linkedin.com/in/aishapatel",
        website: "https://quantumdynamics.com/aisha"
      }
    },
    {
      name: "James Thompson",
      title: "VP of Engineering",
      company: "CloudScale",
      image: "/aivent/images/team/4.webp",
      bio: "Infrastructure architect specializing in scalable cloud solutions and distributed systems.",
      social: {
        twitter: "https://twitter.com/jamesthompson",
        linkedin: "https://linkedin.com/in/jamesthompson"
      }
    },
    {
      name: "Elena Kowalski",
      title: "Product Director",
      company: "UX Innovations",
      image: "/aivent/images/team/5.webp",
      bio: "Design thinking expert focused on human-centered AI interfaces and ethical technology design.",
      social: {
        linkedin: "https://linkedin.com/in/elenakowalski",
        website: "https://uxinnovations.com"
      }
    },
    {
      name: "David Kim",
      title: "CTO",
      company: "SecureNet",
      image: "/aivent/images/team/6.webp",
      bio: "Cybersecurity leader with expertise in AI-powered threat detection and blockchain security.",
      social: {
        twitter: "https://twitter.com/davidkim",
        linkedin: "https://linkedin.com/in/davidkim"
      }
    }
  ]

  return (
    <section id="section-speakers" className="bg-dark section-dark text-light py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="subtitle animate-fade-in-up mb-3">Featured Speakers</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            Learn from the Best
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Hear from global tech pioneers, industry disruptors, and bold thinkers shaping the future across every domain.
          </p>
        </div>

        <div className="spacer-single"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <SpeakerCard
              key={index}
              {...speaker}
              delay={`${index * 0.2}s`}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="animate-fade-in-up animation-delay-1200">
            <p className="text-lg mb-6 opacity-90">
              And many more industry leaders joining us...
            </p>
            <a href="/speakers" className="btn-main">
              View All Speakers
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
