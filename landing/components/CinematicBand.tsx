"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Lock, Share2, Play } from "lucide-react";

export default function CinematicBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-obsidian-mid py-24 px-6"
      aria-label="Cinematic Vault showcase"
    >
      {/* Parallax backdrop text */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ x }}
        aria-hidden="true"
      >
        <span
          className="select-none whitespace-nowrap text-[18vw] font-black uppercase tracking-tighter opacity-[0.03]"
          style={{ fontFamily: "var(--font-display)", color: "#d4af37" }}
        >
          EPIC MOMENT
        </span>
      </motion.div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-gold">
              Cinematic Vault
            </p>
            <h2
              className="mb-6 text-4xl font-black leading-tight text-chalk sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Every stick landing deserves a{" "}
              <em className="italic text-gold">stage.</em>
            </h2>
            <p className="mb-8 text-base leading-relaxed text-chalk-dim/70">
              Upload 60-second clips from your camera roll or record live. The Ascent encrypts every reel and keeps it private until you share — with a watermarked, expiring link that only guardians can approve.
            </p>

            <ul className="flex flex-col gap-4" role="list">
              {[
                { icon: Lock, label: "Private by default", detail: "Guardian approval required before any sharing" },
                { icon: Share2, label: "Watermarked share links", detail: "Auto-expire in 7 days — no permanent exposure" },
                { icon: Play, label: "Coach-ready clips", detail: "One tap to send to recruiting coordinators" },
              ].map(({ icon: Icon, label, detail }) => (
                <li key={label} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10">
                    <Icon size={16} color="#d4af37" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-black text-chalk">{label}</p>
                    <p className="text-sm text-chalk-dim/60">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Mock video player */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="glass-card overflow-hidden">
              {/* Faux video thumbnail */}
              <div
                className="relative flex aspect-video w-full items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
                }}
                aria-label="Video player preview"
              >
                {/* Grid lines */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                  aria-hidden="true"
                />
                {/* Play button */}
                <div className="relative flex flex-col items-center gap-3">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 ring-2 ring-gold/40">
                    <Play size={36} color="#d4af37" fill="#d4af37" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-gold/60">
                    Tap to play
                  </span>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1">
                  <span className="text-xs font-black text-white">0:42</span>
                </div>
                {/* Privacy badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5">
                  <Lock size={10} color="#22c55e" aria-hidden="true" />
                  <span className="text-[10px] font-black uppercase text-green-400">Private</span>
                </div>
              </div>

              {/* Card info strip */}
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-black text-chalk">Epic Moment — Beam Salute</p>
                  <p className="text-xs text-chalk-dim/50">Mar 15, 2026</p>
                </div>
                <div
                  className="rounded-full px-3 py-1.5 text-xs font-black"
                  style={{ backgroundColor: "#d4af3718", color: "#d4af37" }}
                >
                  In Vault
                </div>
              </div>
            </div>

            {/* Glow under card */}
            <div
              className="pointer-events-none absolute -bottom-8 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full blur-2xl"
              style={{ backgroundColor: "rgba(212,175,55,0.1)" }}
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
