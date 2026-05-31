"use client";

import { useEffect, useState } from "react";

const OPEN_HOUR = 9;
const WARNING_HOUR = 16;
const WARNING_MINUTE = 30;
const CLOSE_HOUR = 18;

export default function ShopStatus() {
  const [showStatus, setShowStatus] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();

      const day = now.getDay();
      const isSunday = day === 0;

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const warningMinutes = WARNING_HOUR * 60 + WARNING_MINUTE;
      const closeMinutes = CLOSE_HOUR * 60;
      const openMinutes = OPEN_HOUR * 60;

      if (isSunday) {
        setShowStatus(true);
        setMessage("🔴 We are closed today. We open again on Monday at 09:00.");
        return;
      }

      const shouldShow =
        currentMinutes >= warningMinutes || currentMinutes < openMinutes;

      setShowStatus(shouldShow);

      if (!shouldShow) return;

      if (currentMinutes >= warningMinutes && currentMinutes < closeMinutes) {
        const remainingTotalSeconds =
          closeMinutes * 60 -
          (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());

        const minutes = Math.floor(remainingTotalSeconds / 60);
        const seconds = remainingTotalSeconds % 60;

        setMessage(`⏳ We close in ${minutes}m ${seconds}s`);
      } else {
        setMessage("🔴 The shop is closed. We open at 09:00.");
      }
    };

    updateStatus();

    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!showStatus) return null;

  return (
    <div className="mx-auto mt-3 w-full max-w-7xl rounded-full border border-red-500 bg-red-950 px-4 py-3 text-white">
      <p className="text-center text-sm font-bold">{message}</p>
      <p className="text-center text-xs text-red-300">
        Trading hours: Monday - Saturday, 09:00 - 18:00
      </p>
    </div>
  );
}