// import React from "react";

// export default function HowItWorks() {
//   return (
//     <section className="w-full bg-white text-black">
//       <div className="max-w-6xl mx-auto px-6 py-12">
//         <h2 className="text-3xl font-bold">How it works</h2>
//         <div className="mt-8 grid gap-6 md:grid-cols-3">
//           <div className="p-6 border rounded bg-white shadow-sm">
//             <div className="text-xl font-semibold">1. Create</div>
//             <p className="mt-2 text-gray-700 text-sm">
//               Create your business and services in the Dashboard, and define
//               weekly availability in the business local timezone.
//             </p>
//           </div>

//           <div className="p-6 border rounded bg-white shadow-sm">
//             <div className="text-xl font-semibold">2. Share</div>
//             <p className="mt-2 text-gray-700 text-sm">
//               Share your public booking link — customers view available slots
//               and pick a time that works for them.
//             </p>
//           </div>

//           <div className="p-6 border rounded bg-white shadow-sm">
//             <div className="text-xl font-semibold">3. Confirm</div>
//             <p className="mt-2 text-gray-700 text-sm">
//               Bookings are stored as UTC timestamps and notifications are sent
//               to both you and your customer.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d0950]">
            How it works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Get your booking system live in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: "1",
              title: "Create",
              desc: "Set up your business and services in the dashboard. Define your weekly availability in your local timezone with just a few clicks.",
            },
            {
              num: "2",
              title: "Share",
              desc: "Get a shareable booking link that customers love. They see available slots in their own timezone automatically.",
            },
            {
              num: "3",
              title: "Confirm",
              desc: "Bookings are instantly confirmed with UTC timestamps. Both you and your customers receive notifications automatically.",
            },
          ].map((step) => (
            <div
              key={step.num}
              className="p-8 border border-slate-200 rounded-xl bg-slate-50 hover:border-slate-300 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-lg">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-[#0d0950]">
                  {step.title}
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
