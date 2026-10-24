import { Sparkles } from "lucide-react";

const MESSAGES = [
  "the drop is here",
  "wear the promise · romans 8:28",
  "everyday essentials for the modern believer",
  "welcome to the society",
];

function TickerRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {MESSAGES.map((message) => (
        <div key={message} className="flex items-center">
            <span className="whitespace-nowrap px-6 text-[10px] font-medium tracking-[0.18em] md:px-10 md:text-[11px]">
            {message}
          </span>
          <Sparkles aria-hidden="true" className="h-3 w-3 shrink-0 opacity-80" />
        </div>
      ))}
    </div>
  );
}

export function NewsTicker() {
  return (
    <div
      className="ticker relative flex h-9 w-full mb-8 items-center overflow-hidden"
      role="region"
      aria-label="Announcements"
    >
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 35s linear infinite;
        }
        .ticker:hover .ticker-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>

      <div className="ticker-track flex w-max">
        <TickerRow />
        <TickerRow hidden />
      </div>
    </div>
  );
}
