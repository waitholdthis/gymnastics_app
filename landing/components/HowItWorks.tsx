"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Download, Layers, Trophy } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Download,
    headline: "Download & Build Your Profile",
    body: "Set your USAG level, active apparatus, and goals. The Ascent generates a custom skill library for your exact competitive path in under 60 seconds.",
    color: "#d4af37",
  },
  {
    number: "02",
    icon: Layers,
    headline: "Train, Log, and Level Up",
    body: "Check in skills on your Quest Map after practice. Record Epic Moment reels, log wellness scores, and capture meet results — everything tied to your athlete timeline.",
    color: "#3b82f6",
  },
  {
    number: "03",
    icon: Trophy,
    headline: "Ascend to Competition Ready",
    body: "Watch your Quest Power climb. Coaches see your progress, parents get the conversation tools they need, and you step onto the podium knowing exactly how you got there.",
    color: "#22c55e",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="relative overflow-hidden bg-obsidian-light py-24 px-6"
      aria-label="How The Ascent works"
    >
      {/* Gold radial accent */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/4 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-xs font-black uppercase tracking-widest text-gold"
          >
            The Ascent Protocol
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-black leading-tight text-chalk sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three steps to the{" "}
            <em className="italic text-gold">podium.</em>
          </motion.h2>
        </div>

        {/* Steps with connecting gold line */}
        <div className="relative">
          {/* Animated vertical thread */}
          <div
            className="absolute left-[2.75rem] top-12 hidden w-px bg-glass-border lg:block"
            style={{ height: "calc(100% - 80px)" }}
            aria-hidden="true"
          >
            <motion.div
              className="h-full w-full origin-top"
              style={{
                scaleY: lineHeight,
                background: "linear-gradient(to bottom, #d4af37, #22c55e)",
                transformOrigin: "top",
              }}
            />
          </div>

          <ol className="flex flex-col gap-12" role="list">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.number}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-6 lg:gap-10"
                >
                  {/* Step icon / number */}
                  <div className="flex-shrink-0">
                    <div
                      className="relative flex h-[5.5rem] w-[5.5rem] flex-col items-center justify-center rounded-2xl border"
                      style={{
                        backgroundColor: `${step.color}12`,
                        borderColor: `${step.color}30`,
                      }}
                    >
                      <Icon size={28} color={step.color} strokeWidth={1.5} aria-hidden="true" />
                      <span
                        className="absolute -bottom-2 -right-2 rounded-full px-1.5 py-0.5 text-[10px] font-black"
                        style={{ backgroundColor: step.color, color: "#0a0a0a" }}
                      >
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center">
                    <h3
                      className="mb-2 text-2xl font-black text-chalk"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.headline}
                    </h3>
                    <p className="max-w-lg text-base leading-relaxed text-chalk-dim/70">
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
