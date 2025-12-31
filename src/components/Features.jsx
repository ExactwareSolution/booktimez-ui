// import React from "react";

// function Feature({ title, desc }) {
//   return (
//     <div className="p-6 border rounded bg-white text-black shadow-sm">
//       <h4 className="font-semibold">{title}</h4>
//       <p className="mt-2 text-sm text-gray-700">{desc}</p>
//     </div>
//   );
// }

// export default function Features() {
//   return (
//     <section className="w-full bg-white text-black">
//       <div className="max-w-6xl mx-auto px-6 py-12">
//         <h2 className="text-3xl font-bold">Features that matter</h2>
//         <div className="mt-6 grid md:grid-cols-3 gap-6">
//           <Feature
//             title="Timezone-aware slots"
//             desc="Store business timezone, generate slots in local time and save UTC timestamps for safety."
//           />
//           <Feature
//             title="Plan enforcement"
//             desc="Free/Standard/Pro feature gating for services, languages, and booking limits."
//           />
//           <Feature
//             title="Multilingual"
//             desc="Public booking pages and email templates available in English, Hindi and Arabic (RTL)."
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

export default function Features() {
  const features = [
    {
      title: "Timezone-aware slots",
      desc: "Store business timezone, generate slots in local time and save UTC timestamps for safety.",
    },
    {
      title: "Plan enforcement",
      desc: "Free/Standard/Pro feature gating for services, languages, and booking limits.",
    },
    {
      title: "Multilingual",
      desc: "Public booking pages and email templates available in English, Hindi and Arabic (RTL).",
    },
    {
      title: "Instant notifications",
      desc: "Email confirmations sent immediately to both you and your customers.",
    },
    {
      title: "Shareable links",
      desc: "Simple, memorable booking URLs that work beautifully on mobile and desktop.",
    },
    {
      title: "No manual conflicts",
      desc: "Automatic timezone handling prevents double-bookings and scheduling errors.",
    },
  ];

  return (
    <section
      id="features"
      className="w-full bg-gradient-to-b from-slate-50 to-white py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d0950]">
            Features that matter
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Built for modern businesses with global customers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 border border-slate-200 rounded-xl bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-slate-900 transition-colors duration-200 flex items-center justify-center mb-4">
                <div className="w-5 h-5 border-2 border-slate-900 group-hover:border-white rounded-full transition-colors duration-200"></div>
              </div>
              <h3 className="text-lg font-semibold text-[#0d0950] mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
