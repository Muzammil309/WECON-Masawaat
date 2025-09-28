'use client'

export function ScheduleSection() {
  return (
    <section id="section-schedule" className="bg-dark section-dark text-light">
      <div className="container">
        <div className="row g-4 gx-5 justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="subtitle s2 mb-3 wow fadeInUp" data-wow-delay=".0s">Event Schedule</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">5 Days of AI Excellence</h2>
          </div>
        </div>
        <div className="row g-4 gx-5 justify-content-center wow fadeInUp">
          <div className="col-lg-12">
            <div className="de-tab plain">
              <ul className="d-tab-nav mb-4 pb-4 d-flex justify-content-between">
                <li className="active-tab">
                  <h3>Day 1</h3>
                  Oct 1, 2025
                </li>
                <li>
                  <h3>Day 2</h3>
                  Oct 2, 2025
                </li>
                <li>
                  <h3>Day 3</h3>
                  Oct 3, 2025
                </li>
                <li>
                  <h3>Day 4</h3>
                  Oct 4, 2025
                </li>
                <li>
                  <h3>Day 5</h3>
                  Oct 5, 2025
                </li>
              </ul>
              <ul className="d-tab-content pt-3 wow fadeInUp">   
                {/* day 1 */}                        
                <li>
                  {/* schedule item begin */}
                  <div className="border-white-bottom-op-2 pb-5 mb-5">
                    <div className="row g-4 align-items-center">
                      <div className="col-md-2">
                        08:00 – 10:00 AM
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <img src="/aivent/images/team/1.webp" className="w-100px rounded-1 me-4" alt="" />
                          <div>
                            <h5 className="mb-0">Joshua Henry</h5>
                            AI Research Lead, DeepTech Labs
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h3>Session: Opening Keynote – The State of AI 2025</h3>
                        <p className="fs-15 mb-0">Kick off the event with an insightful overview of where artificial intelligence is headed. Ava will explore breakthroughs, global shifts, and what's next in deep learning, generative models, and AI ethics.</p>
                      </div>
                    </div>
                  </div>
                  {/* schedule item end */}

                  {/* schedule item begin */}
                  <div className="border-white-bottom-op-2 pb-5 mb-5">
                    <div className="row g-4 align-items-center">
                      <div className="col-md-2">
                        12:00 – 14:00 PM
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <img src="/aivent/images/team/2.webp" className="w-100px rounded-1 me-4" alt="" />
                          <div>
                            <h5 className="mb-0">Leila Zhang</h5>
                            VP of Machine Learning, Google
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h3>Session: Building Human-Centered AI Products</h3>
                        <p className="fs-15 mb-0">This session covers how to design AI solutions that prioritize usability, fairness, and real-world impact. Bring your laptop—hands-on UX exercises included.</p>
                      </div>
                    </div>
                  </div>
                  {/* schedule item end */}

                  {/* schedule item begin */}
                  <div className="border-white-bottom-op-2 pb-5 mb-5">
                    <div className="row g-4 align-items-center">
                      <div className="col-md-2">
                        16:00 – 18:00 PM
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <img src="/aivent/images/team/3.webp" className="w-100px rounded-1 me-4" alt="" />
                          <div>
                            <h5 className="mb-0">Carlos Rivera</h5>
                            Founder & CEO, NeuralCore
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h3>Session: AI Policy & Regulation – A Global Overview</h3>
                        <p className="fs-15 mb-0">Learn how nations and organizations are approaching AI governance, including frameworks for data privacy, bias mitigation, and accountability in model deployment.</p>
                      </div>
                    </div>
                  </div>
                  {/* schedule item end */}

                  {/* schedule item begin */}
                  <div className="border-white-bottom-op-2 pb-5 mb-5">
                    <div className="row g-4 align-items-center">
                      <div className="col-md-2">
                        20:00 – 22:00 PM
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <img src="/aivent/images/team/4.webp" className="w-100px rounded-1 me-4" alt="" />
                          <div>
                            <h5 className="mb-0">Maria Gonzalez</h5>
                            Founder & CEO, SynthCore AI
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h3>Session: Building a Startup with AI at the Core</h3>
                        <p className="fs-15 mb-0">Marco shares his journey launching an AI-first startup. Discover tips on tech stacks, team-building, funding, and scaling responsibly.</p>
                      </div>
                    </div>
                  </div>
                  {/* schedule item end */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
