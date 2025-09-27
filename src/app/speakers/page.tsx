"use client";

import { SpeakersSection } from "@/components/aivent/speakers-section";

export default function SpeakersPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Speakers</h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Meet the experts and thought leaders sharing insights at WECON Summit 2025.
        </p>
      </section>
      <SpeakersSection />
    </div>
  );
}

