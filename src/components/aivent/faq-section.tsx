'use client'

export function FaqSection() {
  return (
    <section id="section-faq" className="bg-dark section-dark text-light">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="subtitle wow fadeInUp" data-wow-delay=".0s">Everything You Need to Know</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">Frequently Asked Questions</h2>
            <p className="wow fadeInUp" data-wow-delay=".4s">Find answers to the most common questions about AI Summit 2025. Can't find what you're looking for? Contact our support team.</p>
            
            <div className="spacer-single"></div>
            
            <a className="btn-main fx-slide wow fadeInUp" data-wow-delay=".6s" href="#section-contact">
              <span>Contact Support</span>
            </a>
          </div>

          <div className="col-lg-7">
            <div className="accordion wow fadeInUp" data-wow-delay=".4s" id="accordionFAQ">
              
              <div className="accordion-item bg-dark-2 border-0 mb-3">
                <h2 className="accordion-header" id="faq1">
                  <button className="accordion-button bg-dark-2 text-light border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapse1">
                    What is included in my ticket?
                  </button>
                </h2>
                <div id="collapse1" className="accordion-collapse collapse" aria-labelledby="faq1" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body text-light">
                    Your ticket includes access to all keynotes, workshops, and networking sessions. You'll also receive conference materials, meals, and access to the startup showcase. VIP tickets include additional perks like priority seating and exclusive networking events.
                  </div>
                </div>
              </div>

              <div className="accordion-item bg-dark-2 border-0 mb-3">
                <h2 className="accordion-header" id="faq2">
                  <button className="accordion-button bg-dark-2 text-light border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                    Can I get a refund if I can't attend?
                  </button>
                </h2>
                <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="faq2" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body text-light">
                    Yes, we offer full refunds up to 30 days before the event. Between 30-14 days, we offer 50% refunds. No refunds are available within 14 days of the event, but tickets can be transferred to another person.
                  </div>
                </div>
              </div>

              <div className="accordion-item bg-dark-2 border-0 mb-3">
                <h2 className="accordion-header" id="faq3">
                  <button className="accordion-button bg-dark-2 text-light border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                    Will sessions be recorded?
                  </button>
                </h2>
                <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="faq3" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body text-light">
                    Yes, all keynotes and selected workshops will be recorded and made available to attendees within 48 hours after the event. You'll receive access links via email.
                  </div>
                </div>
              </div>

              <div className="accordion-item bg-dark-2 border-0 mb-3">
                <h2 className="accordion-header" id="faq4">
                  <button className="accordion-button bg-dark-2 text-light border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                    Is there a dress code?
                  </button>
                </h2>
                <div id="collapse4" className="accordion-collapse collapse" aria-labelledby="faq4" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body text-light">
                    Business casual is recommended for most sessions. Some networking events may have specific dress codes which will be communicated in advance. Comfortable shoes are recommended as there will be a lot of walking.
                  </div>
                </div>
              </div>

              <div className="accordion-item bg-dark-2 border-0 mb-3">
                <h2 className="accordion-header" id="faq5">
                  <button className="accordion-button bg-dark-2 text-light border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                    Are meals included?
                  </button>
                </h2>
                <div id="collapse5" className="accordion-collapse collapse" aria-labelledby="faq5" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body text-light">
                    Yes, all tickets include breakfast, lunch, and coffee breaks each day. We accommodate dietary restrictions - please specify any requirements during registration or contact us in advance.
                  </div>
                </div>
              </div>

              <div className="accordion-item bg-dark-2 border-0 mb-3">
                <h2 className="accordion-header" id="faq6">
                  <button className="accordion-button bg-dark-2 text-light border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="false" aria-controls="collapse6">
                    Can I bring guests?
                  </button>
                </h2>
                <div id="collapse6" className="accordion-collapse collapse" aria-labelledby="faq6" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body text-light">
                    Each ticket is for one person only. However, we offer group discounts for teams of 5 or more. Contact our sales team for special pricing on multiple tickets.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
