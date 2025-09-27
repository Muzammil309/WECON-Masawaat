"use client";

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Contact Us</h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Have questions about WECON Summit 2025? Reach out and we'll get back to you.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <form className="space-y-4 rounded-xl border border-white/10 bg-gray-900/40 p-6">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input className="w-full rounded-md bg-gray-900/60 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-600" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" className="w-full rounded-md bg-gray-900/60 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-600" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea rows={5} className="w-full rounded-md bg-gray-900/60 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-600" placeholder="How can we help?" />
            </div>
            <button type="button" className="inline-flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300">Send</button>
          </form>

          <div className="rounded-xl border border-white/10 bg-gray-900/40 p-6">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><strong>Dates:</strong> March 153, 2025</li>
              <li><strong>Location:</strong> Dubai, United Arab Emirates</li>
              <li><strong>Email:</strong> info@wecon.example</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

