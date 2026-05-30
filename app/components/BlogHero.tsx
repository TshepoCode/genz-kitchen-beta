"use client";

import NavBar from "./NavBar";
import ShopStatus from "./ShopStatus";
import Link from "next/link";

const labels = [
  {
    title: "🔥 New Drops",
    href: "/blog/cheesy-jalapeno-fries",
    badge: "NEW",
    className: "bg-lime-100 hover:bg-lime-200 text-lime-700",
    badgeClass: "bg-lime-500 text-black",
  },
  {
    title: "🍔 Burger Updates",
    href: "/blog/burger-updates",
    badge: "Read",
    className: "bg-orange-100 hover:bg-orange-200 text-orange-700",
    badgeClass: "text-orange-600",
  },
  {
    title: "🚚 Delivery News",
    href: "/blog/delivery-news",
    badge: "Read",
    className: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    badgeClass: "text-blue-600",
  },
  {
    title: "💚 Community",
    href: "/blog/community",
    badge: "Read",
    className: "bg-pink-100 hover:bg-pink-200 text-pink-700",
    badgeClass: "text-pink-600",
  },
];

export default function BlogHero() {
  const handleCartClick = () => {
    console.log("Cart clicked");
  };

  return (
    <section className="relative w-full bg-white px-4 pb-10 md:px-6">
      <NavBar onCartClick={handleCartClick} />
      <ShopStatus />

      <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-lime-300/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="mt-5 overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-xl">
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src="/cheesyJalapenoFries.webp"
              alt="GenZ Kitchen"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute left-5 top-5 rounded-full bg-lime-400 px-4 py-2 text-xs font-black uppercase tracking-wide text-black">
              New Drop
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-lime-300">
                GenZ Kitchen News
              </p>

              <h1 className="max-w-2xl text-4xl font-black leading-tight text-white md:text-6xl">
                Food.
                <br />
                Culture.
                <br />
                Good Vibes.
              </h1>

              <p className="mt-4 max-w-xl text-sm text-zinc-200 md:text-base">
                Stay updated with new menu drops, influencer updates, rewards
                news and community stories from GenZ Kitchen.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-zinc-400">
                Latest Article
              </p>

              <p className="mt-1 text-lg font-bold text-black">
                Cheesy Jalapeño Fries Just Dropped 🔥
              </p>
            </div>

            <Link
              href="/blog/cheesy-jalapeno-fries"
              className="flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-lime-500 hover:text-black sm:w-auto"
            >
              Read Story
            </Link>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-5">
          <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
            </div>

            <h2 className="text-2xl font-black text-black">
              “Best Burgers in Kagiso!”
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              The cheesy sauce just makes everything click. The flavor,
              packaging and vibe feels premium. The burgers take you outside
              the hood for a second.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-lg font-black text-black">
                T
              </div>

              <div>
                <p className="font-bold text-black">Tshepo M.</p>
                <p className="text-xs text-zinc-500">Verified Customer</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-black">
                Reading Labels
              </h3>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white">
                4
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {labels.map((label) => (
                <Link
                  key={label.href}
                  href={label.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${label.className}`}
                >
                  <span className="font-bold">{label.title}</span>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-black ${label.badgeClass}`}
                  >
                    {label.badge}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}