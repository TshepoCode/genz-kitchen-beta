"use client";

export default function FeatureStrip() {
  return (
    <div className="w-full overflow-hidden border-y border-lime-500 bg-white py-4 ">
        <div className="flex whitespace-nowrap animate-scroll-right gap-12 text-black font-medium text-sm md:text-base">

            {/* FIRST SET */}
            <div className="flex gap-12 whitespace-nowrap">
                <span>🚀 Quick Delivery</span>
                <span className="text-lime-400">|</span>
                <span>🍔 Awesome Street Food</span>
                <span className="text-lime-400">|</span>
                <span>⭐ Made For Gen Z</span>
            </div>

            {/* SECOND SET (duplicate) */}
            <div className="flex gap-12 whitespace-nowrap">
                <span>🚀 Quick Delivery</span>
                <span className="text-lime-400">|</span>
                <span>🍔 Awesome Street Food</span>
                <span className="text-lime-400">|</span>
                <span>⭐ Made For Gen Z</span>
            </div>    

            {/* SECOND SET (duplicate) */}
            <div className="flex gap-12 whitespace-nowrap">
                <span>🚀 Quick Delivery</span>
                <span className="text-lime-400">|</span>
                <span>🍔 Awesome Street Food</span>
                <span className="text-lime-400">|</span>
                <span>⭐ Made For Gen Z</span>
            </div>  

            {/* SECOND SET (duplicate) */}
            <div className="flex gap-12 whitespace-nowrap">
                <span>🚀 Quick Delivery</span>
                <span className="text-lime-400">|</span>
                <span>🍔 Awesome Street Food</span>
                <span className="text-lime-400">|</span>
                <span>⭐ Made For Gen Z</span>
            </div>                          
        </div>
    </div>
  );
}