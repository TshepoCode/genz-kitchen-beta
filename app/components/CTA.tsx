"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="w-full h-[500px] bg-black text-white px-6 py-16 border-t border-lime-500">
      <div className="max-w-4xl mx-auto text-center space-y-6">

        {/* TITLE */}
        <div className="flex items-center justify-center mt-20 gap-4">
          <div className="h-[2px] w-16 bg-lime-400"></div>

          <h2 className="text-2xl md:text-4xl font-extrabold">
            <span>GET YOUR </span>
            <span className="text-lime-400">ORDER NOW!</span>
          </h2>

          <div className="h-[2px] w-16 bg-lime-400"></div>
        </div>

        {/* SUBTEXT */}
        <p className="text-gray-300 text-sm md:text-base">
          Craving something epic? Order now and satisfy. make sure that you are located near a GenZ Kitchen!
          <br></br> which is in Kagiso Near the Madiba Secondary School. We are open from 9am to 6pm daily. 
          <br></br>Don't miss out on the flavor explosion
          <span className="italic">your hunger!</span>
        </p>

        {/* BUTTON */}
        <Link href="/menu"
         className="bg-lime-400 text-black font-semibold px-8 py-3 rounded-full hover:bg-lime-300 transition">
          ORDER NOW
        </Link>

      </div>
    </section>
  );
} 