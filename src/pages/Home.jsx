import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import WhatWeDo from "../components/WhatWeDo";
import HowItWorks from "../components/HowItWorks";
import Plans from "../components/Plans";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-full bg-white text-black">
        
      <Hero />
      <Features />
      <WhatWeDo />
      <HowItWorks />
      <Plans />
      <Footer />
    </div>
  );
}

