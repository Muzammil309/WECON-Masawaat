'use client'

export function AiventHeader() {
  return (
    <header className="transparent">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="de-flex">
              <div className="de-flex-col">
                {/* logo begin */}
                <div id="logo">
                  <a href="/">
                    <img className="logo-main" src="/aivent/images/logo.webp" alt="" />
                    <img className="logo-scroll" src="/aivent/images/logo.webp" alt="" />
                    <img className="logo-mobile" src="/aivent/images/logo.webp" alt="" />
                  </a>
                </div>
                {/* logo close */}
              </div>

              <div className="de-flex-col">
                <div className="de-flex-col header-col-mid">
                  <ul id="mainmenu">
                    <li><a className="menu-item active" href="#section-hero">Home</a></li>
                    <li><a className="menu-item" href="#section-about">About</a></li>
                    <li><a className="menu-item" href="#section-why-attend">Why Attend</a></li>
                    <li><a className="menu-item" href="#section-speakers">Speakers</a></li>
                    <li><a className="menu-item" href="#section-schedule">Schedule</a></li>
                    <li><a className="menu-item" href="#section-tickets">Tickets</a></li>
                    <li><a className="menu-item" href="#section-venue">Venue</a></li>
                    <li><a className="menu-item" href="#section-faq">FAQ</a></li>
                  </ul>
                </div>
              </div>

              <div className="de-flex-col">
                <a className="btn-main fx-slide w-100" href="#section-tickets">
                  <span>Buy Tickets</span>
                </a>

                <div className="menu_side_area">
                  <span id="menu-btn"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
