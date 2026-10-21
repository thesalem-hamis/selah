import { useEffect, useState } from "react";

const MESSAGES = [
  "complimentary shipping on orders over £50",
  "the drop is here",
  "wear the promise · Romans 8:28",
  "everyday essentials for the modern believer",
  "welcome to the society",
];

export function AnnouncementSlider() {
  const [activeMessage, setActiveMessage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveMessage((current) => (current + 1) % MESSAGES.length);
    }, 10_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="home-shipping-note" role="region" aria-label="Announcements">
      <span key={activeMessage} className="home-announcement-message" aria-live="polite">
        {MESSAGES[activeMessage]}
      </span>
    </div>
  );
}
