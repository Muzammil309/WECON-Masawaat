'use client'

export function MarqueeSection() {
  const marqueeItems = [
    "Next Intelligence",
    "Future Now", 
    "Empowering Innovation",
    "Smarter Tomorrow",
    "Think Forward",
    "Cognitive Shift",
    "Digital Transformation",
    "Tech Revolution"
  ]

  return (
    <section id="section-marquee" className="section-dark p-0" aria-label="section">
      {/* First Marquee Row */}
      <div className="bg-color text-light d-flex py-4 lh-1 rot-2 overflow-hidden">
        <div className="de-marquee-list-1 animate-fade-in-left">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center whitespace-nowrap">
              {marqueeItems.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center">
                  <span className="fs-60 mx-3 font-bold">{item}</span>
                  <span className="fs-60 mx-3 op-2">/</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Second Marquee Row */}
      <div className="bg-color-2 text-light d-flex py-4 lh-1 rot-min-1 mt-min-20 overflow-hidden">
        <div className="de-marquee-list-2 animate-fade-in-right">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center whitespace-nowrap">
              {marqueeItems.reverse().map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center">
                  <span className="fs-60 mx-3 font-bold">{item}</span>
                  <span className="fs-60 mx-3 op-2">/</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
