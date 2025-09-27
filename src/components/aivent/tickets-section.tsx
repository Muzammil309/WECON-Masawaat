'use client'

import Link from 'next/link'
import { Check, Star } from 'lucide-react'

interface TicketTierProps {
  name: string
  price: string
  originalPrice?: string
  description: string
  features: string[]
  isPopular?: boolean
  isEarlyBird?: boolean
  delay?: string
}

function TicketCard({ name, price, originalPrice, description, features, isPopular, isEarlyBird, delay = "0s" }: TicketTierProps) {
  return (
    <div 
      className={`relative group animate-scale-in ${isPopular ? 'lg:scale-105' : ''}`}
      style={{ animationDelay: delay }}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <Star className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}
      
      {isEarlyBird && (
        <div className="absolute -top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-xs font-semibold">
            Early Bird
          </div>
        </div>
      )}

      <div className={`bg-dark-2 rounded-1 overflow-hidden h-full transition-all duration-300 ${
        isPopular 
          ? 'border-2 border-purple-500 hover:border-purple-400' 
          : 'border border-gray-700 hover:border-gray-600'
      } ${isPopular ? 'hover-bg-color' : 'hover:bg-dark-3'}`}>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
              {name}
            </h3>
            <p className="text-sm opacity-80 mb-6 group-hover:text-white transition-colors">
              {description}
            </p>
            
            <div className="mb-6">
              {originalPrice && (
                <div className="text-lg text-gray-500 line-through mb-1">
                  {originalPrice}
                </div>
              )}
              <div className="text-4xl font-bold text-primary group-hover:text-white transition-colors">
                {price}
              </div>
              {isEarlyBird && (
                <div className="text-sm text-green-400 mt-1">
                  Limited Time Offer
                </div>
              )}
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                <span className="text-sm group-hover:text-white transition-colors">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div className="text-center">
            <Link
              href="/events"
              className={`btn-main w-full block text-center ${
                isPopular ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''
              }`}
            >
              Get Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TicketsSection() {
  const ticketTiers = [
    {
      name: "General Access",
      price: "$299",
      originalPrice: "$399",
      description: "Perfect for individuals looking to learn and network",
      isEarlyBird: true,
      features: [
        "Access to all keynote sessions",
        "General networking areas",
        "Digital event materials",
        "Basic workshop access",
        "Event mobile app",
        "Certificate of attendance"
      ]
    },
    {
      name: "Professional",
      price: "$599",
      originalPrice: "$799",
      description: "Ideal for professionals seeking deeper engagement",
      isPopular: true,
      isEarlyBird: true,
      features: [
        "Everything in General Access",
        "Priority seating at sessions",
        "Access to all workshops",
        "VIP networking events",
        "1-on-1 speaker meetups",
        "Exclusive lunch sessions",
        "Premium swag bag",
        "Post-event resource access"
      ]
    },
    {
      name: "Enterprise",
      price: "$1,299",
      originalPrice: "$1,599",
      description: "Complete access for teams and organizations",
      isEarlyBird: true,
      features: [
        "Everything in Professional",
        "Private meeting rooms",
        "Dedicated account manager",
        "Custom workshop sessions",
        "Executive roundtables",
        "Premium catering access",
        "Team photo opportunities",
        "Post-event consultation call",
        "Bulk discount for 5+ tickets"
      ]
    }
  ]

  return (
    <section id="section-tickets" className="bg-dark section-dark text-light py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="subtitle animate-fade-in-up mb-3">Event Tickets</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            Choose Your Experience
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Select the perfect ticket tier for your needs. Early bird pricing available for a limited time.
          </p>
        </div>

        <div className="spacer-single"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ticketTiers.map((tier, index) => (
            <TicketCard
              key={index}
              {...tier}
              delay={`${index * 0.2}s`}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="animate-fade-in-up animation-delay-1000">
            <p className="text-sm opacity-80 mb-4">
              * All prices are in USD. Group discounts available for 10+ tickets.
            </p>
            <p className="text-sm opacity-80">
              Need a custom package? <a href="/contact" className="text-primary hover:underline">Contact our team</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
