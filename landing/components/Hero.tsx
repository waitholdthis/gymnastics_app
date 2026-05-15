"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

/* Gold thread SVG — drawn on load via CSS stroke-dashoffset animation */
function GoldThread() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path
        className="gold-thread"
        d="M -80 600 C 200 400, 400 800, 720 480 S 1100 200, 1520 380"
        fill="none"
        stroke="#d4af37"
        strokeWidth="1.5"
        strokeOpacity="0.45"
      />
      <path
        className="gold-thread"
        d="M -80 700 C 250 550, 500 820, 780 560 S 1140 280, 1520 440"
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.6"
        strokeOpacity="0.22"
        style={{ animationDelay: "0.4s" }}
      />
      <path
        className="gold-thread"
        d="M 200 900 C 400 700, 600 860, 900 640 S 1280 360, 1520 500"
        fill="none"
        stroke="#e8c84a"
        strokeWidth="0.4"
        strokeOpacity="0.15"
        style={{ animationDelay: "0.9s" }}
      />
    </svg>
  );
}

const SILK: [number, number, number, number] = [0.16, 1, 0.3, 1];

const WORD_VARIANTS = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.13, duration: 0.75, ease: SILK },
  }),
};

const HEADLINE_WORDS = ["Where", "Gymnastics", "Meets", "Precision."];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Parallax: video drifts 12% slower than scroll */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  /* Pause video when user prefers reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-obsidian px-6 pt-24 text-center"
      aria-label="Hero section"
    >
      {/* ── VIDEO BACKGROUND ── */}
      {/* Scale to 1.16 so parallax drift never exposes edges */}
      <motion.div
        className="absolute inset-0 origin-center"
        style={{ y: videoY, scale: 1.16 }}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src="/gymnastics_hero_bkgd.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* ── OVERLAY STACK (bottom → top) ── */}
      {/* 1. Primary dark wash — makes video readable without killing it */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "rgba(8, 8, 14, 0.62)" }}
        aria-hidden="true"
      />
      {/* 2. Cinematic vignette — edges + bottom crush to black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 40%, transparent 35%, rgba(8,8,14,0.55) 100%)",
        }}
        aria-hidden="true"
      />
      {/* 3. Bottom gradient — fades into TrustBar */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.85) 70%, #0a0a0a 100%)",
        }}
        aria-hidden="true"
      />
      {/* 4. Top shadow — protects nav text */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-32"
        style={{
          background: "linear-gradient(to bottom, rgba(8,8,14,0.7) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* 5. Gold radial glow — centers behind headline */}
      <div
        className="pointer-events-none absolute left-1/2 top-[40%] h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.10) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />

      {/* ── GOLD THREAD (above overlays) ── */}
      <GoldThread />

      {/* ── CONTENT ── */}
      <motion.div
        className="relative z-10 flex max-w-4xl flex-col items-center"
        style={{ opacity: contentOpacity }}
      >
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SILK }}
          className="mb-7 flex items-center gap-2 rounded-full border border-gold/25 px-4 py-2"
          style={{ backgroundColor: "rgba(212,175,55,0.08)", backdropFilter: "blur(8px)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-widest text-gold">
            Now in Early Access
          </span>
        </motion.div>

        {/* Headline — word-by-word reveal */}
        <h1
          className="mb-5 text-5xl font-black leading-[1.08] tracking-tight text-chalk sm:text-7xl lg:text-[5.5rem]"
          style={{
            fontFamily: "var(--font-display)",
            textShadow: "0 2px 32px rgba(0,0,0,0.6)",
          }}
        >
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              variants={WORD_VARIANTS}
              initial="hidden"
              animate="visible"
              className={`mr-[0.2em] inline-block last:mr-0 ${
                i === 3 ? "italic text-gold" : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease: SILK }}
          className="mb-10 max-w-xl text-lg leading-relaxed sm:text-xl"
          style={{ color: "rgba(245,245,245,0.78)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
        >
          The precision platform for gymnasts who refuse to peak too early — skill maps, cinematic reels, and coach connections, all in one place.
        </motion.p>

        {/* CTA cluster */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.65, ease: SILK }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#cta"
            className="group relative overflow-hidden rounded-full bg-gold px-9 py-4 text-sm font-black uppercase tracking-wide text-obsidian transition-all duration-300 hover:shadow-[0_0_44px_rgba(212,175,55,0.5)]"
          >
            <span className="relative z-10">Begin Your Ascent</span>
            <span
              className="absolute inset-0 -translate-x-full bg-gold-light transition-transform duration-300 group-hover:translate-x-0"
              aria-hidden="true"
            />
          </a>
          <a
            href="#features"
            className="rounded-full px-9 py-4 text-sm font-semibold text-chalk/80 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-200 hover:ring-gold/50 hover:text-gold"
          >
            Explore Features
          </a>
        </motion.div>

        {/* Social proof micro-line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.55, duration: 0.6 }}
          className="mt-7 text-[11px] font-medium uppercase tracking-widest"
          style={{ color: "rgba(245,245,245,0.38)" }}
        >
          120+ partner clubs · Levels 3–Elite · USAG-aligned
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#trust"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-gold transition-colors duration-200"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </motion.a>
    </section>
  );
}
