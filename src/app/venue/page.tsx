"use client";

export default function VenuePage() {
  return (
    <div className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Venue</h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Dubai, UAE — March 15–19, 2025. More details including maps, hotels, and travel tips will be shared with registered attendees.
        </p>
        <div className="rounded-xl overflow-hidden border border-white/10 bg-gray-900/40">
          <img src="/aivent/images/placeholder/venue.webp" alt="Venue" className="w-full h-64 object-cover" />
        </div>
      </section>
    </div>
  );
}

