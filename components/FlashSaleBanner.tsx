
import React, { useState, useEffect } from 'react';

interface FlashSaleBannerProps {
  isActive: boolean;
}

const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ isActive }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  if (!isActive) return null;

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-amber-500 py-3 text-white text-center font-black text-[11px] uppercase tracking-[0.2em] relative z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>
      <div className="relative flex items-center justify-center gap-4">
        <i className="fa-solid fa-bolt animate-bounce text-amber-100"></i>
        <span>Flash Sale Active on Selected Medical Gear</span>
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-lg border border-white/20 ml-2">
          <span className="text-amber-100">Ends In:</span>
          <span className="font-mono tabular-nums text-[13px] tracking-normal">
            {format(timeLeft.hours)}:{format(timeLeft.minutes)}:{format(timeLeft.seconds)}
          </span>
        </div>
        <i className="fa-solid fa-bolt animate-bounce text-amber-100"></i>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
