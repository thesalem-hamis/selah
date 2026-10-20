import { useId } from "react";

interface ChromeOrnamentProps {
  variant: "heart" | "star";
  className?: string;
}

export function ChromeOrnament({ variant, className = "" }: ChromeOrnamentProps) {
  const id = useId().replace(/:/g, "");
  const gradientId = `chrome-gradient-${id}`;
  const shineId = `chrome-shine-${id}`;
  const shape = variant === "heart"
    ? "M50 88 14.5 55.2C-2 39.8 5.7 14.7 27 12.8 38.2 12.1 46.6 18.2 50 29.1c3.4-10.9 11.8-17 23-16.3 21.3 1.9 29 27 12.5 42.4L50 88Z"
    : "M50 3 57.2 39.5 91 50 57.2 60.5 50 97 42.8 60.5 9 50 42.8 39.5 50 3Z";

  return (
    <svg
      className={`chrome-ornament ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="15" y1="12" x2="84" y2="89" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset=".2" stopColor="#aeb4bb" />
          <stop offset=".38" stopColor="#fdfefe" />
          <stop offset=".58" stopColor="#858d96" />
          <stop offset=".78" stopColor="#eef1f4" />
          <stop offset="1" stopColor="#9da4ac" />
        </linearGradient>
        <linearGradient id={shineId} x1="22" y1="21" x2="68" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".96" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={shape} fill={`url(#${gradientId})`} stroke="#fff" strokeOpacity=".9" strokeWidth="2.2" />
      {variant === "heart" ? (
        <path d="M20 35c1.5-8 7-13 14-14" stroke={`url(#${shineId})`} strokeLinecap="round" strokeWidth="4" />
      ) : (
        <path d="M48 13v28M17 50h27" stroke={`url(#${shineId})`} strokeLinecap="round" strokeWidth="3" />
      )}
    </svg>
  );
}
