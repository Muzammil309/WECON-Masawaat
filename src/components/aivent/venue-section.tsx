'use client'

export function VenueSection() {
  return (
    <section id="section-venue" className="bg-dark section-dark text-light pt-80 relative jarallax" aria-label="section">
      <div className="container relative z-2">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="subtitle wow fadeInUp" data-wow-delay=".0s">Event Location</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">Location & Venue</h2>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-lg-8">
            <div className="bg-dark-2 p-40 rounded-1 relative overflow-hidden wow fadeInUp">
              <div className="row g-4 align-items-center">
                <div className="col-md-6">
                  <h3>San Francisco Convention Center</h3>
                  <p className="mb-4">Located in the heart of San Francisco's SOMA district, our venue offers state-of-the-art facilities with stunning views of the city skyline.</p>
                  
                  <div className="mb-3">
                    <i className="fa fa-location-pin id-color me-3"></i>
                    <span>121 AI Blvd, San Francisco, CA 94107</span>
                  </div>
                  
                  <div className="mb-3">
                    <i className="fa fa-phone id-color me-3"></i>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  
                  <div className="mb-3">
                    <i className="fa fa-envelope id-color me-3"></i>
                    <span>info@aisummit2025.com</span>
                  </div>

                  <div className="spacer-single"></div>

                  <h4>Venue Features</h4>
                  <ul className="ul-check">
                    <li>5,000 seat main auditorium</li>
                    <li>12 breakout rooms for workshops</li>
                    <li>Exhibition hall for startup showcase</li>
                    <li>High-speed WiFi throughout</li>
                    <li>Live streaming capabilities</li>
                    <li>Accessibility compliant</li>
                  </ul>
                </div>

                <div className="col-md-6">
                  <img src="/aivent/images/misc/s2.webp" className="w-100 rounded-1" alt="Venue" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="spacer-single"></div>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="bg-dark-2 p-30 rounded-1 text-center wow fadeInUp" data-wow-delay=".2s">
              <i className="fs-60 icofont-car id-color mb-3"></i>
              <h4>Parking</h4>
              <p className="mb-0">Complimentary parking available for all attendees. Valet service available for VIP ticket holders.</p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="bg-dark-2 p-30 rounded-1 text-center wow fadeInUp" data-wow-delay=".4s">
              <i className="fs-60 icofont-train id-color mb-3"></i>
              <h4>Public Transport</h4>
              <p className="mb-0">Easily accessible via BART, Muni, and Caltrain. Montgomery Station is just 2 blocks away.</p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="bg-dark-2 p-30 rounded-1 text-center wow fadeInUp" data-wow-delay=".6s">
              <i className="fs-60 icofont-hotel id-color mb-3"></i>
              <h4>Accommodation</h4>
              <p className="mb-0">Partner hotels within walking distance. Special rates available for conference attendees.</p>
            </div>
          </div>
        </div>

        <div className="spacer-double"></div>

        <div className="row">
          <div className="col-lg-12">
            <div className="bg-dark-2 p-40 rounded-1 wow fadeInUp">
              <h3 className="text-center mb-4">Getting There</h3>
              <div className="row g-4">
                <div className="col-md-6">
                  <h5><i className="fa fa-plane id-color me-2"></i>By Air</h5>
                  <p>San Francisco International Airport (SFO) - 30 minutes by car or BART<br />
                  Oakland International Airport (OAK) - 45 minutes by car or BART</p>
                </div>
                <div className="col-md-6">
                  <h5><i className="fa fa-car id-color me-2"></i>By Car</h5>
                  <p>From Highway 101: Take the 4th Street exit<br />
                  From I-80: Take the Harrison Street exit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
