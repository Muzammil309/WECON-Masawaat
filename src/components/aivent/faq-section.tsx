'use client'

export function FaqSection() {
  return (
    <section id="section-faq" className="bg-dark section-dark text-light">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="subtitle wow fadeInUp" data-wow-delay=".0s">Everything You Need to Know</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">Frequently Asked Questions</h2>
          </div>

          <div className="col-lg-7">
            <div className="accordion s2 wow fadeInUp">
              <div className="accordion-section">
                <div className="accordion-section-title" data-tab="#accordion-a1">
                  What is the AI Summit 2025?
                </div>
                <div className="accordion-section-content" id="accordion-a1">
                  The AI Summit 2025 is a premier event gathering leading AI experts, thought leaders, and innovators. It features keynotes, workshops, panels, and networking opportunities focusing on the latest advancements in artificial intelligence.
                </div>

                <div className="accordion-section-title" data-tab="#accordion-a2">
                  When and where will the event be held?
                </div>
                <div className="accordion-section-content" id="accordion-a2">
                  The AI Summit 2025 will take place from **[Event Dates]** at **[Event Location]**. More details about the venue and directions will be provided closer to the event.
                </div>

                <div className="accordion-section-title" data-tab="#accordion-a3">
                  How can I register for the event?
                </div>
                <div className="accordion-section-content" id="accordion-a3">
                  You can register for the AI Summit 2025 through our official website. Simply choose your ticket type and fill out the registration form.
                </div>

                <div className="accordion-section-title" data-tab="#accordion-a4">
                  What ticket options are available?
                </div>
                <div className="accordion-section-content" id="accordion-a4">
                  We offer a range of ticket options, including Standard, VIP, Full Access Pass, Student, and Virtual tickets. You can find more details about each ticket type on our [Tickets Page](#).
                </div>

                <div className="accordion-section-title" data-tab="#accordion-a5">
                  Can I transfer my ticket to someone else?
                </div>
                <div className="accordion-section-content" id="accordion-a5">
                  Tickets are non-transferable. If you are unable to attend, please contact our support team for assistance.
                </div>

                <div className="accordion-section-title" data-tab="#accordion-a6">
                  Will there be virtual participation?
                </div>
                <div className="accordion-section-content" id="accordion-a6">
                  Yes! For those who can't attend in person, we offer a **Virtual Ticket**. This provides access to live-streamed sessions, workshops, and networking opportunities online.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
