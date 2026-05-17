"use client";

import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import FeatureStrip from "./components/FeatureStrip";
import FanFavorites from "./components/FanFavorite";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import AnimatedWords from "./components/AnimatedWords";
import OurStory from "./components/OurStory";


export default function Home() {
  const handleCartClick = () => {
    // Add your cart click logic here
  };

  return (
    <>
      <div className="overflow-hidden h-auto items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <NavBar onCartClick={handleCartClick} />
        <Hero />
        <AnimatedWords />
        <FeatureStrip />
        <OurStory />
        <FeatureStrip />
        <FanFavorites />
        <CTA />
        <Footer />
      </div>
    </>
  );
}
   