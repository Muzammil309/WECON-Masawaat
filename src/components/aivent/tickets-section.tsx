'use client'

export function TicketsSection() {
  return (
    <section id="section-tickets" className="bg-dark section-dark text-light pt-80 relative jarallax" aria-label="section">
      <img src="/aivent/images/background/7.webp" className="jarallax-img" alt="" />
      <div className="gradient-edge-top"></div>
      <div className="gradient-edge-bottom"></div>
      <div className="sw-overlay op-7"></div>

      <div className="container relative z-2">
        <div className="row g-4 gx-5 justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="subtitle s2 mb-3 wow fadeInUp" data-wow-delay=".0s">Ticket Options</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">Choose Your Pass</h2>
            <p className="lead wow fadeInUp" data-wow-delay=".4s">Select the perfect ticket for your needs and gain access to exclusive sessions, workshops, and more.</p>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-lg-12">
            <div className="owl-carousel owl-theme owl-3-dots wow mask-right">
              {/* ticket item begin */}
              <div className="item">
                <div className="d-ticket">
                  <img src="/aivent/images/logo.webp" className="w-80px mb-4" alt="" />
                  <img src="/aivent/images/misc/barcode.webp" className="w-20 p-2 abs abs-middle end-0 me-2" alt="" />
                  <img src="/aivent/images/logo-big-white.webp" className="w-40 abs abs-centered me-4 op-2" alt="" />
                  <h2>Standard</h2>
                  <h4 className="mb-4">$299</h4>
                  <div className="fs-14">October 1 to 5 - 10:00 AM</div>
                </div>

                <div className="relative overflow-hidden">
                  <div className="py-4 z-2">
                    <ul className="ul-check mb-4">
                      <li>Access to keynotes and sessions.</li>
                      <li>Admission to exhibitions and demos.</li>
                      <li>Networking opportunities.</li>
                      <li>Digital materials and session recordings.</li>
                    </ul>
                  </div>

                  <a className="btn-main fx-slide w-100" href="tickets.html"><span>Buy Ticket</span></a>
                </div>
              </div>
              {/* ticket item end */}

              {/* ticket item begin */}
              <div className="item">
                <div className="d-ticket">
                  <img src="/aivent/images/logo.webp" className="w-80px mb-4" alt="" />
                  <img src="/aivent/images/misc/barcode.webp" className="w-20 p-2 abs abs-middle end-0 me-2" alt="" />
                  <img src="/aivent/images/logo-big-white.webp" className="w-40 abs abs-centered me-4 op-2" alt="" />
                  <h2>VIP</h2>
                  <h4 className="mb-4">$699</h4>
                  <div className="fs-14">October 1 to 5 - 10:00 AM</div>
                </div>
                <div className="relative">
                  <div className="py-4 z-2">
                    <ul className="ul-check mb-4">
                      <li>All Standard benefits.</li>
                      <li>VIP lounge access and exclusive events.</li>
                      <li>Front-row seating and priority workshop access.</li>
                      <li>VIP swag bag and exclusive content.</li>
                    </ul>
                  </div>
                </div>

                <a className="btn-main fx-slide w-100" href="tickets.html"><span>Buy Ticket</span></a>
              </div>
              {/* ticket item end */}

              {/* ticket item begin */}
              <div className="item">
                <div className="d-ticket">
                  <img src="/aivent/images/logo.webp" className="w-80px mb-4" alt="" />
                  <img src="/aivent/images/misc/barcode.webp" className="w-20 p-2 abs abs-middle end-0 me-2" alt="" />
                  <img src="/aivent/images/logo-big-white.webp" className="w-40 abs abs-centered me-4 op-2" alt="" />
                  <h2>Full Access</h2>
                  <h4 className="mb-4">$1299</h4>
                  <div className="fs-14">October 1 to 5 - 10:00 AM</div>
                </div>
                <div className="relative">
                  <div className="py-4 z-2">
                    <ul className="ul-check mb-4">
                      <li>All VIP benefits.</li>
                      <li>Exclusive speaker meet & greets.</li>
                      <li>Private workshops and masterclasses.</li>
                      <li>Premium networking events and dinners.</li>
                    </ul>
                  </div>
                </div>

                <a className="btn-main fx-slide w-100" href="tickets.html"><span>Buy Ticket</span></a>
              </div>
              {/* ticket item end */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
