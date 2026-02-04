import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-[#0d0950] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-slate-100/30 pointer-events-none" />
      <div className="absolute right-[-300px] top-40 w-[600px] h-[600px] bg-blue-200 opacity-[0.08] rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 w-full z-10">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">
                {" "}
                BookTimez — Smarter, timezone-aware scheduling made simple
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                {" "}
                Turn your business into a 24/7 booking engine with multilingual
                pages, automated scheduling, timezone-accurate slots, and a
                clean booking experience your customers will love.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Get Started Free
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-slate-300 text-[#0d0950] font-medium rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
              >
                View Features
              </a>
            </div>

            {/* Stats */}
            <div className="pt-8 grid grid-cols-3 gap-8 border-t border-slate-200">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-[#0d0950]">50+</div>
                <div className="text-sm text-slate-600 font-medium">
                  Timezones
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-[#0d0950]">3</div>
                <div className="text-sm text-slate-600 font-medium">
                  Languages
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-[#0d0950]">99.9%</div>
                <div className="text-sm text-slate-600 font-medium">Uptime</div>
              </div>
            </div>
          </motion.div>

          {/* Right Card - Booking Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex justify-center md:justify-end"
          >
            <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl text-white space-y-6 hover:shadow-2xl transition-shadow duration-300">
              {/* Card Header */}
              <div className="space-y-3 border-b border-slate-700 pb-6">
                <div className="text-xs uppercase tracking-widest text-slate-200 font-semibold">
                  Booking Link
                </div>
                <div className="text-sm font-semibold text-white break-all">
                  www.booktimez/booking/your-business
                </div>
                <div className="inline-block px-3 py-1 bg-slate-700 rounded text-xs font-medium text-slate-200">
                  Shareable • Auto-timezone
                </div>
              </div>

              {/* Available Slots */}
              <div className="space-y-3">
                <div className="text-sm text-slate-100 font-medium">
                  Available Slots
                </div>
                <div className="space-y-2">
                  {[
                    { title: "Consultation", time: "Mon, 10:00 AM (GMT+5:30)" },
                    { title: "Service Call", time: "Tue, 2:30 PM (GMT+5:30)" },
                  ].map((slot, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-700/40 backdrop-blur-sm border border-slate-600 rounded-lg px-4 py-3 hover:bg-slate-700/60 transition-all duration-200"
                    >
                      <div className="space-y-1">
                        <div className="font-medium text-white text-sm">
                          {slot.title}
                        </div>
                        <div className="text-xs text-slate-400">
                          {slot.time}
                        </div>
                      </div>
                      <button className="text-xs font-semibold text-slate-200 hover:text-white transition-colors duration-200 px-3 py-1 rounded hover:bg-slate-600/40">
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-700 text-xs text-slate-300 text-center">
                Instant confirmations • No timezone conflicts
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
