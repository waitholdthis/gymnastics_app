"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "The Ascent finally gave us a language to talk about gymnastics at home that doesn't end in tears. The parent scripts alone are worth every penny.",
    name: "Sarah M.",
    role: "Gymnastics Mom · Level 6",
    avatar: "SM",
    color: "#d4af37",
  },
  {
    quote:
      "My daughter tracks her own skills now. She comes to practice knowing exactly what she's working toward. Her ownership has completely changed the gym dynamic.",
    name: "Coach Renata K.",
    role: "Head Coach · Precision Athletics",
    avatar: "RK",
    color: "#3b82f6",
  },
  {
    quote:
      "Watching my Quest Map fill up is the best motivation I've ever had. I went from struggling kip to bar release skills in one season.",
    name: "Mia T.",
    role: "Level 7 Gymnast, Age 13",
    avatar: "MT",
    color: "#22c55e",
  },
  {
    quote:
      "The Epic Moment reel feature let us submit college recruiting clips in 10 minutes with a proper privacy link. I can't overstate how much that mattered.",
    name: "David L.",
    role: "Parent · Elite Gymnast Recruiting",
    avatar: "DL",
    color: "#ec4899",
  },
  {
    quote:
      "Wellness check-ins surfaced a soreness pattern in our Level 5s that we completely missed during dry-land. We restructured rest days — zero overuse injuries that season.",
    name: "Coach Priya N.",
    role: "Assistant Coach · Stars Gymnastics",
    avatar: "PN",
    color: "#f97316",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (dir: 1 | -1) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => paginate(1), 6000);
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[index];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <section
      id="testimonials"
      className="bg-obsidian py-24 px-6"
      aria-label="Testimonials"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-xs font-black uppercase tracking-widest text-gold"
          >
            Voices from the Vault
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-black leading-tight text-chalk sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Real results.{" "}
            <em className="italic text-gold">Real gymnasts.</em>
          </motion.h2>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 sm:p-12"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Quote icon */}
              <Quote
                size={32}
                color={t.color}
                strokeWidth={1.5}
                className="mb-6 opacity-60"
                aria-hidden="true"
              />

              <blockquote className="mb-8">
                <p
                  className="text-xl font-medium leading-relaxed text-chalk sm:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-black text-obsidian"
                  style={{ backgroundColor: t.color }}
                  aria-hidden="true"
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-black text-chalk">{t.name}</p>
                  <p className="text-sm text-chalk-dim/60">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between">
          {/* Dot indicators */}
          <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === index ? "24px" : "8px",
                  backgroundColor: i === index ? "#d4af37" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-glass-border text-chalk-dim transition-colors duration-150 hover:border-gold hover:text-gold"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-glass-border text-chalk-dim transition-colors duration-150 hover:border-gold hover:text-gold"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
