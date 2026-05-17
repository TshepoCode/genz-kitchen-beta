"use client";

import Image from "next/image";

export default function OurStory() {
  return (
    <section className="w-full bg-lime-500 mx-auto text-center py-20 px-6">

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

      <h2 className="text-3xl font-bold mb-6 mt-15">Our Story</h2>

      <p className="text-white  text-center leading-relaxed">
        Gen Z Kitchen was built for a new generation — people who want more
        than just a meal. We took everyday street food and turned it into
        something bold, loud, and unforgettable. From juicy burgers to loaded
        fries, every item is crafted to deliver flavour, attitude, and a
        premium street-food experience.

        <br />
        <br />

        Gen Z Kitchen is now operating as an online food delivery service,
        bringing our unique flavours straight to your door. We are in Kagiso,
        and since the FYP hashtag is filled with Kagiso content, this is the
        best time to start our own movement. We are for the youth, by the
        youth. We’re not just a restaurant — we’re a movement.

        <br />
        <br />

        Join us and taste the vibe!
      </p>
    </section>
  );
}