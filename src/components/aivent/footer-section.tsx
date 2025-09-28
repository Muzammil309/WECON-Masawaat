'use client'

export function FooterSection() {
  return (
    <footer className="text-light section-dark" style={{ marginBottom: 0, paddingBottom: 0 }}>
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-12">
            <div className="d-lg-flex align-items-center justify-content-between text-center">
              <div>
                <h3 className="fs-20">Address</h3>
                121 AI Blvd, San Francisco<br />
                BCA 94107
              </div>
              <div>
                <img src="/aivent/images/logo.webp" className="w-150px" alt="" /><br />
                <div className="social-icons mb-sm-30 mt-4">
                  <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="#"><i className="fa-brands fa-instagram"></i></a>
                  <a href="#"><i className="fa-brands fa-twitter"></i></a>
                  <a href="#"><i className="fa-brands fa-youtube"></i></a>
                </div>
              </div>
              <div>
                <h3 className="fs-20">Contact Us</h3>
                T. +1 123 456 789<br />
                M. contact@aivent.com
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="subfooter" style={{ marginBottom: 0, paddingBottom: '20px' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              Copyright 2025 - AIvent by Designesia
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
