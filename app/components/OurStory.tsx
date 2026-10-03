"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Heart,
  Sparkles,
} from "lucide-react";

export default function OurStory() {
  return (
    <section className="relative w-full overflow-hidden bg-[#080808] text-white">
      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-lime-400/10 blur-[130px]" />

        <div className="absolute -right-40 bottom-10 h-[400px] w-[400px] rounded-full bg-lime-400/5 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {/* =========================================
            TOP LABEL
        ========================================= */}

        <div className="mb-8 flex justify-center lg:justify-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2">
            <Flame
              size={15}
              className="text-lime-400"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-400 sm:text-xs">
              This Is GenZ Kitchen
            </span>
          </div>
        </div>

        {/* =========================================
            MAIN GRID
        ========================================= */}

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* =======================================
              IMAGE
          ======================================= */}

          <div className="relative">
            {/* Lime background block */}

            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-[28px] bg-lime-400 sm:-bottom-4 sm:-right-4" />

            {/* Image */}

            <div className="relative h-[340px] w-full overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-900 sm:h-[450px] lg:h-[560px]">
              <Image
                src="/kasistyledwrap.webp"
                alt="GenZ Kitchen Kasi Styled Wrap"
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="
                  (max-width: 1024px) 100vw,
                  50vw
                "
              />

              {/* Dark image gradient */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Image text */}

              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-400">
                  Street Food Reimagined
                </p>

                <p className="mt-2 max-w-sm text-xl font-black leading-tight text-white sm:text-2xl">
                  Made in the kasi.
                  <br />
                  Built for the new generation.
                </p>
              </div>
            </div>

            {/* Floating badge */}

            <div className="absolute -bottom-6 left-5 z-20 rounded-2xl border border-zinc-800 bg-black px-4 py-3 shadow-2xl sm:left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
                  <Heart
                    size={18}
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    Made With
                  </p>

                  <p className="text-sm font-black text-white">
                    Kasi Love
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =======================================
              STORY
          ======================================= */}

          <div className="pt-8 lg:pt-0">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-400">
              Our Story
            </p>

            <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              MORE THAN
              <br />

              <span className="text-lime-400">
                JUST FOOD.
              </span>
            </h2>

            <div className="mt-7 space-y-5 text-sm font-medium leading-7 text-zinc-400 sm:text-base">
              <p>
                GenZ Kitchen was built for a new
                generation — people who want more
                than just a meal.
              </p>

              <p>
                We took everyday street food and
                turned it into something bold,
                loud and unforgettable. From
                juicy burgers to loaded fries,
                every item is made to deliver
                flavour, attitude and a premium
                street-food experience.
              </p>

              <p>
                GenZ Kitchen operates as an online
                food service, bringing our unique
                flavours closer to our community.
                Born in Kagiso, we are building
                something made for the youth,
                by the youth.
              </p>
            </div>

            {/* =====================================
                STATEMENT
            ===================================== */}

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-400 text-black">
                  <Sparkles size={19} />
                </div>

                <div>
                  <p className="text-lg font-black text-white sm:text-xl">
                    We&apos;re not just a
                    restaurant.
                  </p>

                  <p className="mt-1 text-lg font-black text-lime-400 sm:text-xl">
                    We&apos;re a movement.
                  </p>
                </div>
              </div>
            </div>

            {/* =====================================
                CTA
            ===================================== */}

            <div className="mt-7">
              <Link
                href="/menu"
                className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-7 py-4 text-sm font-black text-black transition duration-300 hover:bg-lime-300 sm:w-auto"
              >
                Taste The Vibe

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================
            BOTTOM BRAND MESSAGE
        ========================================= */}

        <div className="mt-20 border-t border-zinc-900 pt-8 sm:mt-24">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 sm:text-xs">
            BORN IN THE KASI
            <span className="mx-3 text-lime-400">
              •
            </span>
            BUILT FOR GEN Z
            <span className="mx-3 text-lime-400">
              •
            </span>
            MADE DIFFERENT
          </p>
        </div>
      </div>
    </section>
  );
}