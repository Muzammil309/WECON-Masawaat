"use client";


export default function FAQPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Answers to common questions about WECON Summit 2025.
        </p>

        <div className="w-full max-w-3xl space-y-4">
          <details className="rounded-lg border border-white/10 bg-gray-900/40 p-4">
            <summary className="cursor-pointer text-lg font-semibold">Where is the event located?</summary>
            <p className="mt-2 text-sm text-muted-foreground">WECON Summit 2025 will be held in Dubai, UAE. Venue details will be provided to registered attendees.</p>
          </details>
          <details className="rounded-lg border border-white/10 bg-gray-900/40 p-4">
            <summary className="cursor-pointer text-lg font-semibold">Can I transfer my ticket?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Yes, ticket transfers are allowed up to 7 days before the event. Contact support with your order ID.</p>
          </details>
          <details className="rounded-lg border border-white/10 bg-gray-900/40 p-4">
            <summary className="cursor-pointer text-lg font-semibold">Do you offer student discounts?</summary>
            <p className="mt-2 text-sm text-muted-foreground">We offer limited student passes. Please watch our announcements for availability.</p>
          </details>
        </div>
      </section>
    </div>
  );
}

