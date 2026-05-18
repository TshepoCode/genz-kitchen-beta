"use client";

import NavBar from "../components/NavBar";
import Image from "next/image";
import { useEffect, useState } from "react";
import FeatureStrip from "../components/FeatureStrip";


export default function AboutPage() {
  const words = ["Vibe", "Community", "Family", "Journey"];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const handleCartClick = () => {
    // handle cart button click
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 500);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

return (
  <div className="bg-black text-white min-h-screen">
      <NavBar onCartClick={handleCartClick} />

      
        <section className="text-center py-24 px-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-lime-400">
                More Than Food, It’s a{" "}
                <span
                className={`text-white inline-block transition-all duration-500 ${
                    fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                >
                {words[index]}
                </span>
            </h1>

            <p className="mt-6 text-zinc-100 max-w-2xl mx-auto text-lg">
                Gen Z Kitchen is where bold flavours meet street culture.
                We don’t just serve food — we serve energy.
            </p>
        </section>

      
        <section className="max-w-6xl mx-auto px-6">
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-zinc-800">
                <Image
                src="/singlemingleburger.jpg"
                alt="Gen Z Kitchen Food"
                fill
                className="object-cover"
                />
            </div>
        </section>

      
        <section className="max-w-4xl mx-auto text-center py-20 px-6">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-zinc-100 leading-relaxed">
                Gen Z Kitchen was built for a new generation — people who want more
                than just a meal. We took everyday street food and turned it into
                something bold, loud, and unforgettable. From juicy burgers to loaded
                fries, every item is crafted to deliver flavour, attitude, and a
                premium street-food experience. GenZ kitchen is now operating as a 
                Online Food Delivery Service, bringing our unique flavours straight to
                your door. We are in Kagiso and since the fyp hash tag is filled with some 
                kagiso content this is the best time to start our own movement. we are for the 
                Youth By the Youth. We’re not just a restaurant — we’re a movement.
                Join us and taste the vibe!
            </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-lime-400 transition">
                <h3 className="text-xl font-bold text-lime-400 mb-3">
                    Bold Flavours
                </h3>
                <p className="text-zinc-200">
                    Every bite hits different. We don’t do basic.
                </p>
                </div>

                <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-lime-400 transition">
                <h3 className="text-xl font-bold text-lime-400 mb-3">
                    Fast & Fresh
                </h3>
                <p className="text-zinc-200">
                    Made quick. Made right. Always fresh.
                </p>
                </div>

                <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-lime-400 transition">
                <h3 className="text-xl font-bold text-lime-400 mb-3">
                    Gen Z Energy
                </h3>
                <p className="text-zinc-200">
                    Trendy, loud, and made to stand out.
                </p>
                </div>

            </div>
        </section>   


        <FeatureStrip />

        
        <section className="max-w-6xl mx-auto mt-10 px-6 pb-24 grid md:grid-cols-2 gap-10 items-center">
        
            <div>
                <h2 className="text-3xl font-bold mb-6">
                The Experience
                </h2>
                <p className="text-zinc-400 leading-relaxed">
                From your first bite to the last drip of sauce, every meal is
                designed to hit different. We focus on flavour, presentation,
                and that “wow” moment that keeps you coming back.
                </p>
            </div>

            <div className="relative w-full h-[300px] rounded-2xl overflow-hidden border border-zinc-800">
                <Image
                src="/heromeal.jpg"
                alt="Fries"
                fill
                className="object-cover"
                />
            </div>

        </section>

      
        <section className="text-center py-20 border-t border-zinc-800">
            <h2 className="text-3xl font-bold mb-6">
                Ready To Taste The Vibe?
            </h2>

            <div className="flex justify-center gap-4">
                <a
                href="/menu"
                className="bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
                >
                View Menu
                </a>

                <button className="border border-lime-400 text-lime-400 px-6 py-3 rounded-lg font-semibold hover:bg-lime-400 hover:text-black transition">
                Order Now
                </button>

                <a
                href="/menu"
                className="bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
                >
                Order Through whatsapp
                </a>    
            </div>
        </section>


    </div>
  );
}