"use client";

import Image from "next/image";

const items = [
  {
    name: "2 Cheezy Grilled Hotdogs.",
    image: "/CheezygrilledhotdogspecialFriday.png",
  },
  {
    name: "Give Me Zungu Burger Meal",
    image: "/GiveMeZunguburgerpromo.png",
  },
  {
    name: "Kasi Flamed Tacos",
    image: "/FlaminHotStreet-styleTacos.png",
  },
  {
    name: "Level Up Your Wrap Game",
    image: "/Levelupyourwrapgame.png",
  },
];

export default function FanFavorites() {
  return (
    <section className="w-full bg-white text-black px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-[2px] w-16 bg-lime-600"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-lime-600">
            FAN FAVORITES
          </h2>
          <div className="h-[2px] w-16 bg-lime-600"></div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
            >
              <div className="relative w-full h-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 text-center bg-lime-600 hover:bg-lime-500">
                <p className="font-semibold text-white">{item.name}</p>
              </div>
            </div> 
          ))}
        </div>

      </div>
    </section>
  );
}