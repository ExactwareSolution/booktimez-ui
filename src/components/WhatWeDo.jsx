// import React from "react";

// export default function WhatWeDo() {
//   return (
//     <section className="w-full bg-white text-black">
//       <div className="max-w-6xl mx-auto px-6 py-12">
//         <h2 className="text-3xl font-bold">What we do</h2>
//         <p className="mt-4 text-gray-700">
//           BookTimez helps small businesses accept bookings with timezone-aware
//           slots, public booking pages, multilingual templates, and plan-based
//           feature limits. We focus on reliability, simplicity, and keeping your
//           scheduling in sync across timezones.
//         </p>

//         <div className="mt-6 grid md:grid-cols-3 gap-6 text-gray-700">
//           <div>
//             <h4 className="font-semibold">Public pages</h4>
//             <p className="mt-1 text-sm">
//               Shareable booking pages customers love.
//             </p>
//           </div>
//           <div>
//             <h4 className="font-semibold">Timezone safe</h4>
//             <p className="mt-1 text-sm">
//               Slots generated in business local time.
//             </p>
//           </div>
//           <div>
//             <h4 className="font-semibold">Plans & limits</h4>
//             <p className="mt-1 text-sm">
//               Feature gating for Free / Standard / Pro.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

export default function WhatWeDo() {
  const highlights = [
    {
      title: "Built for small teams",
      desc: "Clinics, salons, consultants, and agencies",
    },
    {
      title: "Timezone mastery",
      desc: "UTC-safe bookings with local time display",
    },
    { title: "Global reach", desc: "Support for 50+ timezones, 10+ languages" },
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d0950]">
            What we do
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            BookTimez helps small businesses accept bookings with timezone-aware
            slots, public booking pages, multilingual templates, and plan-based
            feature limits. We focus on reliability, simplicity, and keeping
            your scheduling in sync across timezones.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
            >
              <h3 className="font-semibold text-[#0d0950] text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
