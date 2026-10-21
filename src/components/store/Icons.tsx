import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const MenuIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19.5C7 16 4.5 13.2 4.5 10.2A3.7 3.7 0 0 1 12 8.6a3.7 3.7 0 0 1 7.5 1.6c0 3-2.5 5.8-7.5 9.3z" />
  </Svg>
);

export const BagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 8.5h13l-1 11h-11z" />
    <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" />
  </Svg>
);

/* NEW: Ship Icon */
export const ShipIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 17h18l-1.5-6h-15z" />
    <path d="M6 11V6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5" />
    <path d="M8 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    <path d="M16 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </Svg>
);

/* NEW: Pickup Icon */
export const PickupIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
    <circle cx="12" cy="11" r="2" />
  </Svg>
);
