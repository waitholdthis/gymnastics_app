export default function Footer() {
  return (
    <footer className="border-t border-glass-border bg-obsidian px-6 py-10" role="contentinfo">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <a
          href="#"
          className="text-base font-black tracking-tight text-chalk"
          style={{ fontFamily: "var(--font-display)" }}
          aria-label="The Ascent home"
        >
          The{" "}
          <em className="italic text-gold">Ascent</em>
        </a>
        <p className="text-xs text-chalk-dim/40">
          © {new Date().getFullYear()} The Ascent. Built for gymnasts who refuse to peak too early.
        </p>
        <nav aria-label="Footer navigation">
          <ul className="flex gap-6" role="list">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-xs text-chalk-dim/40 transition-colors duration-150 hover:text-gold"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
