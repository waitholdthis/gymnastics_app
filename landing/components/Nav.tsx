"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#cta" },
];

const EARLY_ACCESS_EMAIL = "tootiedesigns18@gmail.com";
const EARLY_ACCESS_MAILTO = `mailto:${EARLY_ACCESS_EMAIL}?subject=The%20Ascent%20Early%20Access`;

export default function Nav() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: `rgba(10,10,10,${bgOpacity})`,
        borderBottomColor: `rgba(212,175,55,${borderOpacity})`,
        borderBottomWidth: "1px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 text-xl font-black tracking-tight text-chalk"
          style={{ fontFamily: "var(--font-display)" }}
          aria-label="The Ascent home"
        >
          The{" "}
          <em className="italic text-gold">Ascent</em>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-chalk-dim transition-colors duration-150 hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#cta"
            className="rounded-full border border-glass-border px-5 py-2 text-sm font-semibold text-chalk transition-colors duration-150 hover:border-gold hover:text-gold"
          >
            Sign In
          </a>
          <a
            href={EARLY_ACCESS_MAILTO}
            className="rounded-full bg-gold px-5 py-2 text-sm font-black text-obsidian transition-all duration-200 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(212,175,55,0.4)]"
          >
            Get Early Access
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-glass-border text-chalk md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="border-t border-glass-border bg-obsidian px-6 pb-6 pt-4 md:hidden"
        >
          <ul className="flex flex-col gap-4" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-medium text-chalk-dim hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={EARLY_ACCESS_MAILTO}
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-full bg-gold py-3 text-center text-sm font-black text-obsidian"
          >
            Get Early Access
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
