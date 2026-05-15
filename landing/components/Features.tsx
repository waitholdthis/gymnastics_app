"use client";

import { motion } from "framer-motion";
import {
  Map,
  Film,
  HeartPulse,
  BookOpen,
  MessageSquare,
  GraduationCap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Map,
    color: "#d4af37",
    label: "Quest Map",
    headline: "Skill Roadmap",
    body: "Gamified progression from Foundational to Elite. Tap through Training → Mastered → Podium Ready on every apparatus. No guessing — just the next mission.",
    tag: "Vault · Bars · Beam · Floor",
  },
  {
    icon: Film,
    color: "#3b82f6",
    label: "Cinematic Vault",
    headline: "Epic Moment Reels",
    body: "Upload or record 60-second clips. Every reel stays private by default. Share with a watermarked, guardian-approved link that expires in 7 days.",
    tag: "Fort Knox Privacy",
  },
  {
    icon: HeartPulse,
    color: "#22c55e",
    label: "Recovery Lab",
    headline: "Wellness Check-In",
    body: "Daily energy, soreness, and focus logs. Pattern recognition surfaces rest-day signals before overuse injuries happen.",
    tag: "Athlete Safety First",
  },
  {
    icon: BookOpen,
    color: "#ec4899",
    label: "Meet Journal",
    headline: "Score & Confidence Log",
    body: "Capture scores, execution highlights, and mental wins after every meet. Build a performance portfolio across seasons.",
    tag: "Longitudinal View",
  },
  {
    icon: MessageSquare,
    color: "#f97316",
    label: "Coach Connection",
    headline: "Goal-Aligned Feedback",
    body: "Coaches set shared goals, add session notes, and track skill benchmarks — all in one thread per gymnast, no chat app required.",
    tag: "FERPA-Aligned",
  },
  {
    icon: GraduationCap,
    color: "#d4af37",
    label: "Parent Academy",
    headline: "Mindset Scripts",
    body: "Evidence-based conversation guides for post-meet car rides, slumps, and breakthrough moments. Be the parent every gymnast needs.",
    tag: "Sport Psychology–Backed",
  },
];

const SILK: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.65, ease: SILK },
  }),
};

export default function Features() {
  return (
    <section
      id="features"
      className="bg-obsidian py-24 px-6"
      aria-label="Platform features"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-xs font-black uppercase tracking-widest text-gold"
          >
            The Six Pillars
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-black leading-tight text-chalk sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything a gymnast{" "}
            <em className="italic text-gold">deserves.</em>
          </motion.h2>
          <div className="rule-gold mx-auto mt-6 w-32" aria-hidden="true" />
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.article
                key={feat.headline}
                custom={i}
                variants={CARD_VARIANTS}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card group relative overflow-hidden p-7 transition-colors duration-300"
                aria-label={feat.headline}
              >
                {/* Color accent top strip */}
                <div
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: feat.color }}
                  aria-hidden="true"
                />

                {/* Icon */}
                <div
                  className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${feat.color}18` }}
                >
                  <Icon size={24} color={feat.color} strokeWidth={1.5} aria-hidden="true" />
                </div>

                {/* Label */}
                <p
                  className="mb-1 text-[10px] font-black uppercase tracking-widest"
                  style={{ color: feat.color }}
                >
                  {feat.label}
                </p>

                {/* Headline */}
                <h3
                  className="mb-3 text-xl font-black text-chalk"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {feat.headline}
                </h3>

                {/* Body */}
                <p className="mb-5 text-sm leading-relaxed text-chalk-dim/70">{feat.body}</p>

                {/* Tag */}
                <span
                  className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    borderColor: `${feat.color}30`,
                    color: feat.color,
                    backgroundColor: `${feat.color}10`,
                  }}
                >
                  {feat.tag}
                </span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
