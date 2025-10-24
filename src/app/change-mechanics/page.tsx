'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Target, Rocket, Menu, X, ArrowRight, Quote } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button, Card, CardBody, CardHeader, Avatar, Link } from '@heroui/react';
import type { FC } from 'react';

const HeroSection: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-20" />
      
      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-7xl md:text-8xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            Welcome to{' '}
            <span className="gradient-text">Change Mechanics</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            A result-oriented business training and consultancy firm that delivers exceptional value by helping organizations achieve their goals through practical solutions and expert guidance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              color="primary" 
              className="magnetic-button text-lg px-8 py-6"
              endContent={<ArrowRight size={20} />}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="bordered" 
              className="magnetic-button text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-foreground/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const AboutSection: FC = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1663137658384-a9c36b3cd99d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwZmxvd2luZyUyMHNoYXBlcyUyMG1vZGVybnxlbnwwfDB8fG9yYW5nZXwxNzU5OTE4MjM3fDA&ixlib=rb-4.1.0&q=85"
          alt="Abstract gradient background with flowing shapes, modern design, orange and blue tones, smooth transitions - Akshar Dave🌻 on Unsplash"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            We understand that the business environment in Pakistan is{' '}
            <span className="gradient-text">constantly evolving</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            As a business leader you are on a voyage to discover your company's full potential. Let us be your guides on this journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Sparkles, title: 'Innovation-Driven Solutions', desc: 'We specialize in fostering a culture of innovation within organizations. Our team works closely with clients to identify areas for improvement and implement creative solutions.' },
            { icon: Target, title: 'Goal-Driven Business Training', desc: 'We provide customized and result-oriented training programs that help organizations achieve their specific goals. Our training solutions are designed to enhance skills and improve productivity.' },
            { icon: Rocket, title: 'Strategic Consultancy', desc: 'Focused on creating actionable plans that align with our clients\' business objectives and goals. We provide strategies and tools to ensure our clients stay ahead.' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <Card 
                className="glass-card hover:scale-105 transition-transform duration-300 h-full"
                shadow="sm"
              >
                <CardHeader className="flex-col items-start gap-3 pb-0">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <item.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {item.title}
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="text-foreground/70" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {item.desc}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FlagshipSection: FC = () => {
  return (
    <section className="py-32 px-6 bg-content2">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold gradient-text mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Flagship Programmes
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-500">
              <CardBody className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Startup.pk
                  </div>
                  <p className="text-foreground/70 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Startup.pk is our company knowledge and services platform that helps entrepreneurs and startups easily gain entrepreneurial knowledge, tips, and information on funding sources and opportunities.
                  </p>
                </div>
                <Button color="primary" variant="flat" className="magnetic-button">
                  Visit Website
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-500">
              <CardBody className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                    WECON Movement
                  </div>
                  <p className="text-foreground/70 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    WECON Movement is our initiative to support and empower women entrepreneurs in Pakistan. Through various programs, events and conclaves, we bring together stakeholders to highlight women's entrepreneurial challenges.
                  </p>
                </div>
                <Button color="primary" variant="flat" className="magnetic-button">
                  Visit Website
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProjectsSection: FC = () => {
  const projects = [
    { name: 'NIC Faisalabad', logo: 'NICF' },
    { name: 'AP Women Entrepreneurs', logo: 'APWE' },
    { name: 'Founder Institute', logo: 'FI' }
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Our <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="glass-card h-48 flex items-center justify-center">
                <CardBody className="flex items-center justify-center">
                  <div className="text-4xl font-bold text-primary" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {project.logo}
                  </div>
                  <p className="text-sm text-foreground/60 mt-2">{project.name}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button color="primary" size="lg" className="magnetic-button" endContent={<ArrowRight />}>
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

const PartnersSection: FC = () => {
  const partners = [
    'US Embassy', 'USAID', 'Ignite', 'Ministry of IT',
    'Hashoo Foundation', 'TiE Islamabad', 'FFC'
  ];

  return (
    <section className="py-32 px-6 bg-content2">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Trusted By
          </h2>
          <p className="text-foreground/60">Some organizations and companies we have collaborated with</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-6 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <p className="text-center font-semibold text-foreground/70">{partner}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection: FC = () => {
  const testimonials = [
    { quote: "The 1st success above all is that now being a business owner I learned modern techniques that lead me towards my success.", author: "Sobia Aqeel", company: "SAAF International" },
    { quote: "I have learnt true meaning of SEO. Brand name, brand personality and promise etc. Taking my business in to a right direction now.", author: "Syeda Sumana Ali", company: "BB Creations" },
    { quote: "Better productivity and clarity", author: "Irtafa", company: "Shahnawaz Stationery Co" }
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Testimonials
          </h2>
          <p className="text-xl text-foreground/60">Read what our <span className="gradient-text font-semibold">beneficiaries</span> have to say</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <Card className="glass-card h-full">
                <CardBody className="p-8">
                  <Quote className="text-primary mb-4" size={32} />
                  <p className="text-lg mb-6 italic" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={`https://i.pravatar.cc/150?img=${idx + 1}`}
                      size="md"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-foreground/60">{testimonial.company}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: FC = () => {
  return (
    <footer className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 animated-gradient opacity-90" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Change Mechanics
            </h3>
            <p className="text-white/80" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              A result-oriented business training and consultancy firm
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Our Expertise</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/80 hover:text-white">Innovation Solutions</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white">Business Training</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white">Strategic Consultancy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/80 hover:text-white">About Us</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white">Our Projects</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white">Careers</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Get in Touch</h4>
            <Button color="default" className="bg-white text-primary magnetic-button w-full">
              Contact Us
            </Button>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p>© 2023 Change Mechanics Pvt Ltd</p>
          <p className="text-sm mt-2">Powered by Simple Automation Solutions Pvt Ltd</p>
        </div>
      </div>
    </footer>
  );
};

const Navigation: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Syne, sans-serif' }}>
            Change Mechanics
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-foreground hover:text-primary transition-colors">Our Expertise</Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">Blog</Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">Careers</Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">About</Link>
            <Button color="primary" size="sm" className="magnetic-button">
              Contact Us
            </Button>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden mt-4 space-y-4"
          >
            <Link href="#" className="block text-foreground hover:text-primary">Our Expertise</Link>
            <Link href="#" className="block text-foreground hover:text-primary">Blog</Link>
            <Link href="#" className="block text-foreground hover:text-primary">Careers</Link>
            <Link href="#" className="block text-foreground hover:text-primary">About</Link>
            <Button color="primary" size="sm" className="w-full">
              Contact Us
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default function ChangeMechanicsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <FlagshipSection />
      <ProjectsSection />
      <PartnersSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}