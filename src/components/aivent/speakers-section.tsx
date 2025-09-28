'use client'

export function SpeakersSection() {
  return (
    <section id="section-speakers" className="bg-dark section-dark text-light">
      <div className="container">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-6 relative z-3">
            <div className="text-center">
              <div className="subtitle wow fadeInUp" data-wow-delay=".0s">Speakers</div>
              <h2 className="wow fadeInUp" data-wow-delay=".2s">Meet the Visionaries</h2>
              <p className="lead wow fadeInUp">Whether it's a quick refresh or a deep clean transformation, our expert touch leaves your home or office shining.</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="hover relative rounded-1 overflow-hidden wow fadeIn scale-in-mask">
              <img src="/aivent/images/team/1.webp" className="w-100 hover-scale-1-1" alt="" />
              <div className="abs w-100 h-100 start-0 top-0 hover-op-1 radial-gradient-color"></div>
              <div className="abs w-100 start-0 bottom-0 z-3">
                <div className="bg-blur p-4 m-4 rounded-1 text-light text-center relative z-2">
                  <h3 className="mb-0">Joshua Henry</h3>
                  <span>Chief AI Scientist, OpenAI</span>
                </div>
                <div className="gradient-edge-bottom h-100 op-8"></div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="hover relative rounded-1 overflow-hidden wow fadeIn scale-in-mask">
              <img src="/aivent/images/team/2.webp" className="w-100 hover-scale-1-1" alt="" />
              <div className="abs w-100 h-100 start-0 top-0 hover-op-1 radial-gradient-color"></div>
              <div className="abs w-100 start-0 bottom-0 z-3">
                <div className="bg-blur p-4 m-4 rounded-1 text-light text-center relative z-2">
                  <h3 className="mb-0">Leila Zhang</h3>
                  <span>VP of Machine Learning, Google</span>
                </div>
                <div className="gradient-edge-bottom h-100 op-8"></div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="hover relative rounded-1 overflow-hidden wow fadeIn scale-in-mask">
              <img src="/aivent/images/team/3.webp" className="w-100 hover-scale-1-1" alt="" />
              <div className="abs w-100 h-100 start-0 top-0 hover-op-1 radial-gradient-color"></div>
              <div className="abs w-100 start-0 bottom-0 z-3">
                <div className="bg-blur p-4 m-4 rounded-1 text-light text-center relative z-2">
                  <h3 className="mb-0">Carlos Rivera</h3>
                  <span>Founder & CEO, NeuralCore</span>
                </div>
                <div className="gradient-edge-bottom h-100 op-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
