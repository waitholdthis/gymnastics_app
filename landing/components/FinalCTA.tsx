"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Check, Smartphone } from "lucide-react";

const BENEFITS = [
  "Free during Early Access",
  "No credit card required",
  "USAG levels 3–10 + Elite",
  "Cancel anytime",
];

const EARLY_ACCESS_EMAIL = "tootiedesigns18@gmail.com";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    window.location.href = `mailto:${EARLY_ACCESS_EMAIL}?subject=${encodeURIComponent(
      "The Ascent Early Access"
    )}&body=${encodeURIComponent(`Please add me to the early access list.\n\nEmail: ${email}`)}`;
  };

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-obsidian py-28 px-6"
      aria-label="Get early access"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.14) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Gold thread horizontal */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 w-full"
        height="2"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="1"
          x2="100%"
          y2="1"
          stroke="url(#ctaGrad)"
          strokeWidth="1"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="ctaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold-mist px-4 py-2"
        >
          <Smartphone size={13} color="#d4af37" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-widest text-gold">
            iOS &amp; Android · Coming Soon
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 text-5xl font-black leading-tight text-chalk sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The ascent{" "}
          <em className="italic text-gold">starts now.</em>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10 text-lg leading-relaxed text-chalk-dim/70"
        >
          Join 2,800+ gymnasts who are already climbing. Early Access is free — drop your email and we&apos;ll send your invite the moment a spot opens.
        </motion.p>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {submitted ? (
            <div className="glass-card flex flex-col items-center gap-4 py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
                <Check size={32} color="#d4af37" aria-hidden="true" />
              </div>
              <p className="text-xl font-black text-chalk" style={{ fontFamily: "var(--font-display)" }}>
                You&apos;re on the list.
              </p>
              <p className="text-sm text-chalk-dim/60">
                We&apos;ll send your Early Access invite to <strong className="text-chalk">{email}</strong>. See you on the podium.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate aria-label="Early access sign-up form">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <label htmlFor="email-input" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-describedby={error ? "email-error" : undefined}
                    aria-invalid={!!error}
                    className="h-14 w-full rounded-full border border-glass-border bg-glass px-6 text-sm text-chalk placeholder-chalk-dim/40 outline-none transition-colors duration-150 focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  className="group flex h-14 items-center justify-center gap-2 rounded-full bg-gold px-8 text-sm font-black text-obsidian transition-all duration-200 hover:bg-gold-light hover:shadow-[0_0_32px_rgba(212,175,55,0.4)] sm:w-auto"
                >
                  Get Early Access
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>
              {error && (
                <p id="email-error" role="alert" className="mt-2 text-sm text-red-400">
                  {error}
                </p>
              )}
            </form>
          )}
        </motion.div>

        {/* Benefits list */}
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2"
          role="list"
        >
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-1.5 text-xs text-chalk-dim/50">
              <Check size={11} color="#d4af37" aria-hidden="true" />
              {b}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
