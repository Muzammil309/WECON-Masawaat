"use client";

import { AboutSection } from "@/components/aivent/about-section";

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">About WECON Summit 2025</h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          The WECON Summit brings together leaders in AI and technology for five days of talks, workshops, and networking.
          Join us in Dubai, UAE from March 15–19, 2025.
        </p>
      </section>
      <AboutSection />
    </div>
  );
}

