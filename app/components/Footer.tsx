"use client";

import { Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white px-6 py-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

          {/* FOLLOW US */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-zinc-700 pb-2 inline-block">
              Follow Us
            </h3>

            <div className="flex justify-center md:justify-start gap-4">
              <div className="bg-zinc-900 p-3 rounded-lg hover:bg-lime-400 hover:text-black transition cursor-pointer">
                <Instagram size={20} />
              </div>

              {/* TikTok placeholder */}
              <div className="bg-zinc-900 p-3 rounded-lg hover:bg-lime-400 hover:text-black transition cursor-pointer">
                🎵
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-zinc-700 pb-2 inline-block">
              Contact Us
            </h3>

            <div className="space-y-2 text-gray-300">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> genzkitchen2026@gmail.com
              </p>

              <p className="flex items-center justify-center md:justify-start gap-2">
                <Phone size={16} /> 067 632 5434
              </p>
            </div>
          </div>

          {/* LOCATION */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-zinc-700 pb-2 inline-block">
              Location
            </h3>

            <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
              <MapPin size={16} />
              Kagiso, Roodeport, Krugersdorp, South Africa
            </p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-10 pt-6 border-t border-zinc-800 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Gen Z Kitchen. All rights reserved.
        </div>

      </div>
    </footer>
  );
}