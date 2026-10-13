// import { useState, useRef, useEffect } from "react";
// import { Link } from "@tanstack/react-router";
// import { Volume2, VolumeX } from "lucide-react";

// export function Hero() {
//   const [isMuted, setIsMuted] = useState(false);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     // Attempt automatic playback on mount
//     if (audioRef.current) {
//       audioRef.current.volume = 0.4;
//       audioRef.current.play().catch(() => {
//         // Autoplay may be restricted by the browser until user interaction
//       });
//     }
//   }, []);

//   const toggleMute = () => {
//     if (audioRef.current) {
//       audioRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   return (
//     <section className="relative h-[85vh] w-full overflow-hidden bg-black">
//       {/* Background Ambient Audio */}
//       <audio ref={audioRef} src="/audio/ambient.mp3" loop autoPlay />

//       {/* Hero Background Image */}
//       <img
//         src="/heromain.png"
//         alt="Selah Girl Society Hero"
//         className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-1000 ease-out"
//       />

//       {/* Subtle Dark Overlay with Soft Blur */}
//       <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

//       {/* Centered Hero Content */}
//       <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
//         <span className="mb-3 text-xs md:text-sm uppercase tracking-[0.3em] font-medium opacity-90">
//           Modest • Intentional • Beautiful
//         </span>

//         <h1
//           className="mb-6 text-5xl md:text-7xl lg:text-8xl font-light leading-none uppercase tracking-wider font-['Alumni_Sans',sans-serif] drop-shadow-md"
//         >
//           Selah Girl Society
//         </h1>

//         <p className="max-w-md text-sm md:text-base font-light text-white/85 leading-relaxed mb-8">
//           Clothing designed for daughters of the King choosing to live with purpose and grace.
//         </p>

//         <Link
//           to="/shop"
//           className="inline-flex h-10 md:h-11 items-center justify-center border border-white bg-white/10 backdrop-blur-md px-8 md:px-10 font-['Alumni_Sans',sans-serif] text-base md:text-lg font-light uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
//         >
//           EXPLORE COLLECTION
//         </Link>
//       </div>

//       {/* Discreet Mute/Unmute Toggle in Corner */}
//       <button
//         type="button"
//         onClick={toggleMute}
//         aria-label={isMuted ? "Unmute background audio" : "Mute background audio"}
//         className="absolute bottom-6 right-6 z-20 flex size-10 items-center justify-center rounded-full bg-black/80 text-white shadow-md transition-all duration-300 hover:bg-black hover:scale-105 active:scale-95"
//       >
//         {isMuted ? (
//           <VolumeX className="size-4 stroke-[1.5]" />
//         ) : (
//           <Volume2 className="size-4 stroke-[1.5]" />
//         )}
//       </button>
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