'use client'

export function TestimonialSection() {
  return (
    <section className="bg-dark section-dark text-light pt-80 relative jarallax" aria-label="section">
      <img src="/aivent/images/background/2.webp" className="jarallax-img" alt="" />
      <div className="gradient-edge-top"></div>
      <div className="gradient-edge-bottom"></div>
      <div className="sw-overlay op-8"></div>
      <div className="container relative z-4">
        <div className="row align-items-center g-5">
          <div className="col-md-4">
            <div className="relative w-100 d-inline-block pe-5">
              <div className="abs bg-color w-80px h-80px rounded-1 text-center end-0 z-2 wow scaleIn">
                <i className="icofont-quote-left text-white fs-40 d-block pt-3"></i>
              </div>
              <img src="/aivent/images/misc/s9.webp" className="w-100 rounded-1 wow scale-in-mask" alt="" />
            </div>
          </div>

          <div className="col-md-8">
            <h3 className="fs-32 mb-4 wow fadeInUp">
              "Artificial intelligence is advancing rapidly, and while it offers immense opportunity, it also poses significant risks. If not properly regulated and aligned with human values, AI could become a fundamental threat to civilization."
            </h3>

            <span>Elon Musk</span>
          </div>
        </div>
      </div>
    </section>
  )
}
