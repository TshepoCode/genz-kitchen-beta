"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnimatedWords() {
  const words = ["Vibe", "Community", "Family", "Journey"];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 400);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="text-center py-24 px-6 bg-white text-black">
      <h1 className="text-5xl md:text-6xl font-extrabold text-lime-600">
        More Than Food, It’s a {" "}
        <span
          className={`text-black inline-block transition-all duration-500 ${
            fade
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-95"
          }`}
        >
          {words[index]}
        </span>
      </h1>

      <p className="mt-6 text-black max-w-2xl mx-auto text-lg">
        Gen Z Kitchen is where bold flavours meet street culture.
        We don’t just serve food — we serve energy.
      </p>

      <h1 className="mt-10 text-3xl md:text-4xl font-bold text-lime-600">
        Login to Join the Gen Z Kitchen Movement!
      </h1>
    
      <p className="mt-6 text-black max-w-2xl mx-auto text-lg">
        GenZ kitchen is the first ever food business that has a point system 
        in a Township area. We reward our customers for their loyalty and engagement.
        Every purchase earns you points that can be redeemed for exclusive rewards, discounts, and special offers.
        Sign up or login to be part of the Gen Z Kitchen family. 
        Get exclusive access to our latest menu drops, special deals,
        and community events!
      </p>

      <div className="mt-10">
        <Link href="/login"
          className="bg-black text-white font-semibold px-8 py-3 rounded-full hover:bg-lime-300 transition">
          LOGIN
        </Link>
      </div>

    </section>
  );
}