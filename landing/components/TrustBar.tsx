"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const STATS = [
  { value: 2847, suffix: "+", label: "Active Gymnasts" },
  { value: 120, suffix: "+", label: "Partner Clubs" },
  { value: 98, suffix: "%", label: "Safety Index" },
  { value: 14, suffix: "×", label: "Avg Skill Growth" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const steps = 60;
    const increment = to / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, to]);

  return (
    <span ref={ref} className="text-shimmer text-4xl font-black tabular-nums lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function TrustBar() {
  return (
    <section
      id="trust"
      className="border-y border-glass-border bg-obsidian-light py-16"
      aria-label="Platform statistics"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <CountUp to={stat.value} suffix={stat.suffix} />
              <span className="text-xs font-bold uppercase tracking-widest text-chalk-dim/60">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
