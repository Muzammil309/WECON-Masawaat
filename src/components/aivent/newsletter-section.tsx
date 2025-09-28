'use client'

export function NewsletterSection() {
  return (
    <section className="bg-dark section-dark text-light pt-80 relative jarallax" aria-label="section">
      <img src="/aivent/images/background/3.webp" className="jarallax-img" alt="" />
      <div className="gradient-edge-top"></div>
      <div className="gradient-edge-bottom"></div>
      <div className="sw-overlay op-8"></div>
      <div className="container relative z-2">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="subtitle wow fadeInUp" data-wow-delay=".0s">Stay in the Loop</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">Join the Future of Innovation</h2>
            <p className="wow fadeInUp" data-wow-delay=".4s">
              Making better things takes time. Drop us your email to stay in the know as we work to reduce our environmental impact. We'll share other exciting news and exclusive offers, too.
            </p>
          </div>
        </div>

        <form className="row justify-content-center">
          <div className="col-md-6 col-lg-4 mb-3 wow fadeInUp" data-wow-delay=".6s">
            <input type="email" className="form-control form-control-lg text-center" placeholder="Enter Your Email Address" required />
          </div>
          <div className="col-auto mb-3 wow fadeInUp" data-wow-delay=".6s">
            <button type="submit" className="btn bg-color text-light btn-lg px-4">SIGN UP</button>
          </div>

          <div className="col-12 text-center wow fadeInUp" data-wow-delay=".8s">
            <div className="form-check d-flex justify-content-center mb-2">
              <input className="form-check-input me-2" type="checkbox" value="" id="updatesCheck" defaultChecked />
              <label className="form-check-label" htmlFor="updatesCheck">
                Keep me updated on other news and exclusive offers
              </label>
            </div>
            <p className="small text-muted wow fadeInUp" data-wow-delay="1s">
              Note: You can opt-out at any time. See our <a href="#" className="text-decoration-underline">Privacy Policy</a> and <a href="#" className="text-decoration-underline">Terms</a>.
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
