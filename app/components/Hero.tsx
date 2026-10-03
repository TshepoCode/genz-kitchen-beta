"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#080808] text-white">
      {/* =========================================
          BACKGROUND EFFECTS
      ========================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Lime glow */}
        <div className="absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-lime-400/10 blur-[120px]" />

        {/* Bottom glow */}
        <div className="absolute -bottom-40 left-1/3 h-[350px] w-[350px] rounded-full bg-lime-400/5 blur-[120px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      {/* =========================================
          HERO
      ========================================= */}

      <div className="relative mx-auto grid min-h-[calc(100svh-70px)] max-w-7xl grid-cols-1 items-center gap-6 px-5 py-10 sm:px-6 md:grid-cols-2 md:gap-8 md:py-16 lg:px-8">
        {/* =======================================
            LEFT CONTENT
        ======================================= */}

        <div className="order-2 flex flex-col items-start md:order-1">
          {/* Badge */}

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-2">
            <Flame
              size={15}
              className="text-lime-400 rounded-2xl"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-lime-400 sm:text-xs">
              Made Different
            </span>
          </div>

          {/* Heading */}

          <h1 className="max-w-3xl text-[42px] font-black leading-[0.9] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[82px]">
            NEXT-LEVEL
            <br />

            <span className="text-lime-400">
              FLAVOR.
            </span>

            <br />

            <span className="text-white">
              NO BORING
            </span>

            <br />

            <span className="text-lime-400">
              BITES.
            </span>
          </h1>

          {/* Description */}

          <p className="mt-6 max-w-lg text-sm font-medium leading-6 text-zinc-400 sm:text-base md:text-lg">
            Burgers, wings, wraps and street
            food made for the new generation.
            Bold flavour. Big portions. Pure
            GenZ Kitchen energy.
          </p>

          {/* Location */}

          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-zinc-300">
            <MapPin
              size={17}
              className="text-lime-400"
            />

            <span>
              GenZ Kitchen
            </span>
          </div>

          {/* Buttons */}

          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/menu"
              className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-7 py-4 text-sm font-black text-black transition duration-300 hover:bg-lime-300 sm:w-auto"
            >
              View Menu

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/deals"
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 px-7 py-4 text-sm font-black text-white transition duration-300 hover:border-lime-400 hover:text-lime-400 sm:w-auto"
            >
              <Sparkles size={17} />

              See Deals
            </Link>
          </div>

          {/* Small message */}

          <div className="mt-7 border-l-2 border-lime-400 pl-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">
              Fresh • Bold • Made to Order
            </p>
          </div>
        </div>

        {/* =======================================
            RIGHT — PRODUCT IMAGE
        ======================================= */}

        <div className="order-1 flex items-center justify-center md:order-2">
          <div className="relative flex h-[300px] w-full max-w-[390px] items-center justify-center sm:h-[390px] md:h-[500px] md:max-w-[520px] lg:h-[580px]">
            {/* Background circle */}

            <div className="absolute h-[230px] w-[230px] rounded-full border border-lime-400/20 bg-lime-400/[0.04] sm:h-[300px] sm:w-[300px] md:h-[390px] md:w-[390px]" />

            {/* Glow */}

            <div className="absolute h-[200px] w-[200px] rounded-full bg-lime-400/15 blur-[80px] sm:h-[280px] sm:w-[280px]" />

            {/* Text behind burger */}

            <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[65px] font-black tracking-[-0.08em] text-white/[0.025] sm:text-[90px] md:text-[110px] lg:text-[135px]">
              GENZ
            </div>

            {/* Burger image */}

            <div className="relative z-10 h-[280px] w-[280px] sm:h-[370px] sm:w-[370px] md:h-[470px] md:w-[470px] lg:h-[540px] lg:w-[540px]">
              <Image
                src="/GiveMeZunguburgerpromo.webp"
                alt="GenZ Kitchen Give Me Zungu Burger"
                fill
                priority
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)]"
                sizes="
                  (max-width: 640px) 280px,
                  (max-width: 768px) 370px,
                  (max-width: 1024px) 470px,
                  540px
                "
              />
            </div>

            {/* Floating price card */}

            <div className="absolute bottom-3 right-0 z-20 rounded-2xl border border-zinc-800 bg-black/80 px-4 py-3 shadow-2xl backdrop-blur-md sm:bottom-8 sm:right-3 md:right-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Give Me Zungu
              </p>

              <p className="mt-1 text-xl font-black text-lime-400 sm:text-2xl">
                R59
              </p>
            </div>

            {/* Fresh badge */}

            <div className="absolute left-0 top-6 z-20 flex items-center gap-2 rounded-full border border-zinc-800 bg-black/80 px-3 py-2 backdrop-blur-md sm:left-3 sm:top-12">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />

              <span className="text-[9px] font-black uppercase tracking-wider text-white sm:text-[10px]">
                Freshly Made
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM STRIP
      ========================================= */}

      <div className="relative border-t border-zinc-900 bg-[#050505]">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600 sm:text-xs">
            BURGERS
            <span className="mx-3 text-lime-400">
              •
            </span>
            WINGS
            <span className="mx-3 text-lime-400">
              •
            </span>
            WRAPS
            <span className="mx-3 text-lime-400">
              •
            </span>
            STREET FOOD
          </p>
        </div>
      </div>
    </section>
  );
}