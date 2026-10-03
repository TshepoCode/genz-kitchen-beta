"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Gift,
  Sparkles,
  Star,
} from "lucide-react";

/* =========================================
   ANIMATED WORDS
========================================= */

const words = [
  "Vibe.",
  "Community.",
  "Family.",
  "Journey.",
];

export default function AnimatedWords() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  /* =========================================
     WORD ANIMATION
  ========================================= */

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      setFade(false);

      timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 400);
    }, 2500);

    return () => {
      clearInterval(interval);

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] text-white">
      {/* =========================================
          BACKGROUND EFFECTS
      ========================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Top lime glow */}

        <div className="absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-lime-400/[0.08] blur-[120px] sm:h-[450px] sm:w-[450px]" />

        {/* Bottom lime glow */}

        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-lime-400/[0.05] blur-[120px]" />

        {/* Subtle grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* =========================================
          MAIN CONTAINER
      ========================================= */}

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* =========================================
            TOP BADGE
        ========================================= */}

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2">
            <Sparkles
              size={15}
              className="text-lime-400"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-lime-400 sm:text-xs">
              More Than Food
            </span>
          </div>
        </div>

        {/* =========================================
            ANIMATED HEADING
        ========================================= */}

        <div className="mx-auto mt-7 max-w-5xl text-center">
          <h2 className="text-[40px] font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl">
            IT&apos;S MORE
            <br />
            THAN FOOD.
          </h2>

          {/* Animated word container */}

          <div className="mt-4 flex min-h-[65px] items-center justify-center sm:min-h-[80px] md:min-h-[100px]">
            <span
              className={`inline-block text-[44px] font-black leading-none tracking-[-0.05em] text-lime-400 transition-all duration-500 sm:text-6xl md:text-7xl lg:text-8xl ${
                fade
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-3 scale-95 opacity-0"
              }`}
            >
              {words[index]}
            </span>
          </div>

          {/* Intro */}

          <p className="mx-auto mt-7 max-w-2xl text-sm font-medium leading-7 text-zinc-400 sm:text-base md:text-lg">
            GenZ Kitchen is where bold flavours meet
            street culture. We don&apos;t just serve
            food — we serve energy, experiences and
            community.
          </p>
        </div>

        {/* =========================================
            DIVIDER
        ========================================= */}

        <div className="mx-auto my-14 flex max-w-xl items-center gap-4 sm:my-20">
          <div className="h-px flex-1 bg-zinc-900" />

          <div className="h-2 w-2 rotate-45 bg-lime-400" />

          <div className="h-px flex-1 bg-zinc-900" />
        </div>

        {/* =========================================
            REWARDS SECTION
        ========================================= */}

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* =======================================
              LEFT CONTENT
          ======================================= */}

          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-lime-400">
              <Crown size={18} />

              <p className="text-xs font-black uppercase tracking-[0.22em]">
                GenZ Rewards
              </p>
            </div>

            <h3 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              EAT.
              <br />
              EARN.
              <br />

              <span className="text-lime-400">
                GET REWARDED.
              </span>
            </h3>

            <p className="mx-auto mt-7 max-w-xl text-sm font-medium leading-7 text-zinc-400 sm:text-base lg:mx-0">
              Every purchase brings you closer to your
              next reward. Create your GenZ Kitchen
              account, collect points and use them to
              unlock rewards, deals and special offers.
            </p>

            {/* Login button */}

            <div className="mt-8">
              <Link
                href="/login"
                className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-8 py-4 text-sm font-black text-black transition duration-300 hover:bg-lime-300 sm:w-auto"
              >
                Login & Join

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <p className="mt-4 text-xs font-medium text-zinc-600">
              Your food should reward you too.
            </p>
          </div>

          {/* =======================================
              REWARDS CARD
          ======================================= */}

          <div className="relative mx-auto w-full max-w-lg">
            {/* Card glow */}

            <div className="absolute inset-10 rounded-full bg-lime-400/10 blur-[90px]" />

            <div className="relative overflow-hidden rounded-[28px] border border-zinc-800 bg-[#0d0d0d] shadow-2xl">
              {/* ===================================
                  CARD HEADER
              =================================== */}

              <div className="border-b border-zinc-800 p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      GenZ Kitchen
                    </p>

                    <h4 className="mt-1 text-xl font-black sm:text-2xl">
                      Rewards Club
                    </h4>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-400 text-black">
                    <Crown size={21} />
                  </div>
                </div>
              </div>

              {/* ===================================
                  CARD BODY
              =================================== */}

              <div className="p-5 sm:p-7">
                {/* Points card */}

                <div className="rounded-2xl bg-lime-400 p-5 text-black sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">
                        GenZ Rewards
                      </p>

                      <p className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                        GZ
                        <span className="ml-2 text-base sm:text-lg">
                          POINTS
                        </span>
                      </p>
                    </div>

                    <Star
                      size={28}
                      fill="currentColor"
                    />
                  </div>

                  <p className="mt-8 text-left text-xs font-bold text-black/60">
                    Order • Earn • Redeem • Repeat
                  </p>
                </div>

                {/* =================================
                    BENEFITS
                ================================= */}

                <div className="mt-5 space-y-3">
                  {/* Earn points */}

                  <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-black p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                      <Star size={18} />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-black text-white">
                        Earn Points
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-zinc-500">
                        Get rewarded whenever you buy.
                      </p>
                    </div>
                  </div>

                  {/* Rewards */}

                  <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-black p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                      <Gift size={18} />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-black text-white">
                        Unlock Rewards
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-zinc-500">
                        Redeem your points for GenZ
                        rewards.
                      </p>
                    </div>
                  </div>

                  {/* Member deals */}

                  <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-black p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                      <Sparkles size={18} />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-black text-white">
                        Member Deals
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-zinc-500">
                        Access special offers and menu
                        drops.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}

            <div className="absolute -bottom-5 right-2 rounded-full border border-zinc-800 bg-black px-4 py-3 shadow-xl sm:right-5">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-400">
                Loyalty Pays
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            BOTTOM BRAND STRIP
        ========================================= */}

        <div className="mt-20 border-t border-zinc-900 pt-8 sm:mt-24">
          <p className="text-center text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600 sm:text-xs sm:tracking-[0.22em]">
            EAT
            <span className="mx-2 text-lime-400 sm:mx-3">
              •
            </span>
            EARN
            <span className="mx-2 text-lime-400 sm:mx-3">
              •
            </span>
            REDEEM
            <span className="mx-2 text-lime-400 sm:mx-3">
              •
            </span>
            REPEAT
          </p>
        </div>
      </div>
    </section>
  );
}