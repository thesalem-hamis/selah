interface ChromeOrnamentProps {
  variant: "heart" | "star";
  className?: string;
}

export function ChromeOrnament({ variant, className = "" }: ChromeOrnamentProps) {
  return (
    <img
      src={variant === "heart" ? "/chrome5.png" : "/chrome2.png"}
      className={`chrome-ornament ${className}`}
      alt=""
      aria-hidden="true"
      decoding="async"
      draggable={false}
    />
  );
}
