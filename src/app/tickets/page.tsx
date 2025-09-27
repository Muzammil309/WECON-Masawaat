"use client";

import { TicketsSection } from "@/components/aivent/tickets-section";

export default function TicketsPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Tickets</h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Choose your pass for WECON Summit 2025. You can also purchase tickets directly on any event page.
        </p>
      </section>
      <TicketsSection />
    </div>
  );
}

