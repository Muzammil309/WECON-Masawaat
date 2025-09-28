'use client'

export function LogoCarouselSection() {
  return (
    <section className="bg-dark section-dark pt-80 relative jarallax" aria-label="section">
      <img src="/aivent/images/background/1.webp" className="jarallax-img" alt="" />
      <div className="gradient-edge-top"></div>
      <div className="gradient-edge-bottom"></div>
      <div className="sw-overlay op-8"></div>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-12 wow fadeInUp">
            <div className="owl-6 no-alpha owl-carousel owl-theme wow mask-right">
              <img src="/aivent/images/logo-light/1.webp" className="w-100 px-4" alt="" />
              <img src="/aivent/images/logo-light/2.webp" className="w-100 px-4" alt="" />
              <img src="/aivent/images/logo-light/3.webp" className="w-100 px-4" alt="" />
              <img src="/aivent/images/logo-light/4.webp" className="w-100 px-4" alt="" />
              <img src="/aivent/images/logo-light/5.webp" className="w-100 px-4" alt="" />
              <img src="/aivent/images/logo-light/6.webp" className="w-100 px-4" alt="" />
              <img src="/aivent/images/logo-light/7.webp" className="w-100 px-4" alt="" />
              <img src="/aivent/images/logo-light/8.webp" className="w-100 px-4" alt="" />
              <img src="/aivent/images/logo-light/9.webp" className="w-100 px-4" alt="" />
              <img src="/aivent/images/logo-light/10.webp" className="w-100 px-4" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
