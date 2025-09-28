'use client'

export function VenueSection() {
  return (
    <section id="section-venue" className="bg-dark section-dark text-light pt-80 relative jarallax" aria-label="section">
      <div className="container relative z-2">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="subtitle wow fadeInUp" data-wow-delay=".0s">Event Location</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">Location & Venue</h2>
            <p className="lead wow fadeInUp" data-wow-delay=".6s">Join us in the heart of innovation at San Francisco Tech Pavilion—surrounded by top hotels, transit, and culture.</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-sm-6">
            <img src="/aivent/images/misc/l1.webp" className="w-100 rounded-1 wow scale-in-mask" alt="" />
          </div>

          <div className="col-sm-6">
            <img src="/aivent/images/misc/l2.webp" className="w-100 rounded-1 wow scale-in-mask" alt="" />
          </div>

          <div className="clearfix"></div>

          <div className="col-lg-4 col-md-6 mb-sm-30">
            <div className="d-flex justify-content-center wow fadeInUp" data-wow-delay=".2s">
              <i className="fs-60 id-color icofont-google-map"></i>
              <div className="ms-3">
                <h4 className="mb-0">Address</h4>
                <p>121 AI Blvd, San Francisco, CA 94107</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-sm-30">
            <div className="d-flex justify-content-center wow fadeInUp" data-wow-delay=".4s">
              <i className="fs-60 id-color icofont-phone"></i>
              <div className="ms-3">
                <h4 className="mb-0">Phone</h4>
                <p>Call: +1 123 456 789</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-sm-30">
            <div className="d-flex justify-content-center wow fadeInUp" data-wow-delay=".6s">
              <i className="fs-60 id-color icofont-envelope"></i>
              <div className="ms-3">
                <h4 className="mb-0">Email</h4>
                <p>contact@aivent.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
