"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="w-full bg-white text-black px-6 py-6 border-b border-lime-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">

                {/* LEFT CONTENT */}
                <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                    <span className="text-black">NEXT-LEVEL </span>
                    <span className="text-lime-400">FLAVOR</span>
                    <br />
                    <span className="text-lime-400">DELIVERED</span>
                    <span className="text-black"> FAST!</span>
                </h1>

                <p className="text-lg text-gray-800">
                    🔥 Fresh, bold & ridiculously tasty! 🔥
                </p>

                <Link 
                    href="/menu"
                    className="bg-lime-400 text-black font-semibold px-6 py-3 rounded-full  hover:bg-lime-300 transition"
                >
                    View Menu  
                </Link>
                </div>

                {/* RIGHT IMAGE */}
                <div className="flex-1 flex justify-center">
                    <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
                        <Image
                        src="/GiveMeZunguburgerpromo.png" // <-- put your image in /public
                        alt="Burger Meal"
                        fill
                        className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}