// import { Link } from "@tanstack/react-router";

// export function Hero() {
//   return (
//     <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF5F7]">
//       <div

//         className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 pt-20 pb-8 transition-opacity hover:opacity-95"
//       >
//         <Link
//           to="/collections"
//         >
//           <img
//             src="/heromain.png"
//             alt="Shop the Collection"
//             className="h-[80vh] md:h-[88vh] w-auto max-w-full object-contain drop-shadow-2xl"
//           />
//         </Link>
//       </div>
//     </section>
//   );
// }


// import { Link } from "@tanstack/react-router";

// export function Hero() {
//   return (
//     <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FFF5F7]">
//       {/* =====================================================
//           BACKGROUND IMAGE
//           Fills the entire hero section like the background video.
//       ====================================================== */}
//       <img
//         src="/heromain.png"
//         alt="Hero Collection"
//         className="absolute inset-0 h-full w-full object-cover"
//       />

//       {/* =====================================================
//           GLASS OVERLAY
//           Softens the image slightly so the header/logo/icons
//           remain visible without hiding the background.
//       ====================================================== */}
//       <div className="pointer-events-none absolute inset-0 bg-white/[0.14] backdrop-blur-[1.5px]" />

//       {/* =====================================================
//           SUBTLE CONTRAST OVERLAY
//           Helps dark logo/icons stand out.
//       ====================================================== */}
//       <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/[0.04]" />
//     </section>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import { Icon } from "@iconify/react";

// export function Hero() {
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [isMuted, setIsMuted] = useState(false);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     audio.volume = 0.25; // Soft ambient volume level

//     // Attempt direct unmuted autoplay
//     const playPromise = audio.play();

//     if (playPromise !== undefined) {
//       playPromise.catch(() => {
//         // Fallback: If autoplay is blocked by browser policy, play automatically on first user interaction
//         const handleFirstInteraction = () => {
//           audio.play().catch(() => {});
//           window.removeEventListener("click", handleFirstInteraction);
//           window.removeEventListener("touchstart", handleFirstInteraction);
//           window.removeEventListener("keydown", handleFirstInteraction);
//         };

//         window.addEventListener("click", handleFirstInteraction, { once: true });
//         window.addEventListener("touchstart", handleFirstInteraction, { once: true });
//         window.addEventListener("keydown", handleFirstInteraction, { once: true });
//       });
//     }
//   }, []);

//   const toggleMute = () => {
//     if (!audioRef.current) return;
//     const newMutedState = !isMuted;
//     audioRef.current.muted = newMutedState;
//     setIsMuted(newMutedState);
//   };

//   return (
//     <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FFF5F7]">
//       {/* BACKGROUND IMAGE (full screen)
//           md:object-top keeps the top of the image (her head) in view on desktop */}
//       <img
//         src="/selah-main.jpeg"
//         alt="Hero Collection"
//         className="absolute inset-0 h-full w-full object-cover object-center md:object-top"
//       />

//       {/* MINIMAL OVERLAY & GRADIENT */}
//       <div className="pointer-events-none absolute inset-0 bg-white/[0.05] backdrop-blur-[0.5px]" />
//       <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

//       {/* MUTE / UNMUTE BUTTON */}
//       <div className="absolute bottom-6 right-6 z-20">
//         <button
//           type="button"
//           onClick={toggleMute}
//           aria-label={isMuted ? "Unmute background music" : "Mute background music"}
//           className={`grid size-10 place-items-center rounded-full shadow-md ring-1 transition-all duration-300 hover:scale-105 active:scale-95 ${
//             isMuted
//               ? "bg-[#1a1a1a] text-white ring-black/20 hover:bg-black"
//               : "bg-white/70 text-[#1a1a1a] ring-white/60 backdrop-blur-md hover:bg-white"
//           }`}
//         >
//           <Icon
//             icon={isMuted ? "ph:speaker-slash-fill" : "ph:speaker-high-light"}
//             className="size-5"
//           />
//         </button>
//       </div>

//       {/* AUTOMATIC BACKGROUND AUDIO */}
//       <audio
//         ref={audioRef}
//         loop
//         preload="auto"
//         src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
//       />
//     </section>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";

const IMAGES = [
  "/selahmain.jpeg",
  // "/selah2.jpeg",
  // "/selah3.jpeg",
  "/selah7.jpeg",
  "/selah5.jpeg",
  // "/selah6.jpeg",
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Auto-slide effect (cycles every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Background Audio Autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const handleFirstInteraction = () => {
          audio.play().catch(() => {});
          window.removeEventListener("click", handleFirstInteraction);
          window.removeEventListener("touchstart", handleFirstInteraction);
          window.removeEventListener("keydown", handleFirstInteraction);
        };

        window.addEventListener("click", handleFirstInteraction, { once: true });
        window.addEventListener("touchstart", handleFirstInteraction, { once: true });
        window.addEventListener("keydown", handleFirstInteraction, { once: true });
      });
    }
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  return (
    <section className="relative mt-20 h-[calc(88svh-5rem)] md:mt-0 md:h-[90vh] md:max-h-[960px] w-full overflow-hidden bg-[#0d0d0d]">
      {/* BACKGROUND IMAGE SLIDESHOW */}
      {IMAGES.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src}
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className={`h-full w-full object-cover object-center md:object-[center_15%] transition-transform duration-1000 ease-out ${
                isActive ? "scale-100" : "scale-105"
              }`}
            />
          </div>
        );
      })}

      {/* EDITORIAL VIGNETTE & OVERLAY */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/25 backdrop-blur-[0.2px]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      {/* HERO CONTENT OVERLAY - CENTERED */}
      <div className="absolute inset-x-0 bottom-10 z-20 px-6 md:px-16 max-w-7xl mx-auto flex flex-col items-center justify-end text-center">
        <div className="max-w-xl w-full text-white flex flex-col items-center justify-center">
          <h1
            style={{ fontFamily: "var(--font-selah), serif" }}
            className="text-4xl md:text-6xl font-light tracking-tight leading-none mb-6 drop-shadow-md text-center"
          >
            The Drop Is Here
          </h1>

          <div>
            <Link
              to="/shop"
              className="inline-block px-8 py-3.5 bg-white text-black border border-white text-xs font-normal uppercase tracking-wider rounded-none shadow-lg transition-all duration-300 hover:bg-white/90 hover:scale-105 active:scale-95"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* SLIDE INDICATOR DOTS */}
        <div className="relative z-30 flex items-center justify-center gap-2 mt-6">
          {IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1 transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MUTE / UNMUTE BUTTON */}
      <div className="absolute bottom-8 right-6 z-20">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute background music" : "Mute background music"}
          className={`grid size-12 place-items-center rounded-full shadow-lg ring-1 transition-all duration-300 hover:scale-105 active:scale-95 ${
            isMuted
              ? "bg-[#1a1a1a] text-white ring-white/20 hover:bg-black"
              : "bg-white/80 text-[#1a1a1a] ring-white/50 backdrop-blur-md hover:bg-white"
          }`}
        >
          <Icon
            icon={isMuted ? "ph:speaker-slash-fill" : "ph:speaker-high-light"}
            className="size-6"
          />
        </button>
      </div>

      {/* AUTOMATIC BACKGROUND AUDIO */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
      />
    </section>
  );
}