/**
 * Navbar.jsx — Sticky navigation bar
 *
 * FEATURES:
 * - Fixed top, full-width, ultra-thin with lime accent left-border
 * - Active section tracking via IntersectionObserver
 * - Magnetic link hover (inline spring, no dep on MagneticButton)
 * - Animated slide-in on mount
 * - Mobile: condensed with menu toggle
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "services", label: "Services" },
  { id: "lab", label: "Lab" },
  { id: "contact", label: "Contact" },
];

// ── Magnetic nav link ─────────────────────────────────────────────────────────
const NavLink = ({ item, isActive, onClick }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 300, damping: 28 });
  const springY = useSpring(my, { stiffness: 300, damping: 28 });

  const onMove = useCallback(
    (e) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left - rect.width / 2) * 0.35);
      my.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    },
    [mx, my],
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.a
      ref={ref}
      className={`nav-link-underline relative font-mono text-[11px] tracking-[0.25em] uppercase px-1 py-2 cursor-pointer transition-colors ${isActive ? "active" : ""}`}
      style={{
        x: springX,
        y: springY,
        color: isActive ? "var(--color-lime)" : "var(--color-muted)",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={(e) => {
        e.preventDefault();
        onClick(item.id);
      }}
      whileHover={{ color: "var(--color-chalk)" }}
    >
      {isActive && (
        <motion.span
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--color-lime)" }}
          layoutId="nav-dot"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      {item.label}
    </motion.a>
  );
};

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = ({ lenisRef }) => {
  const [active, setActive] = useState("about");
  const [menuOpen, setMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  // Active section is only meaningful on the home page
  const displayActive = isHome ? active : "";

  // IntersectionObserver — track which section is most in view (ONLY ON HOME)
  useEffect(() => {
    if (!isHome) return;

    const observerOptions = {
      rootMargin: "-30% 0px -30% 0px", // Focus more on center for cleaner URL feel
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1.0],
    };

    const sectionRatios = {};

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        sectionRatios[entry.target.id] = entry.intersectionRatio;
      });

      // Find section with highest ratio
      let maxRatio = 0;
      let currentActive = "about";

      Object.entries(sectionRatios).forEach(([id, ratio]) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          currentActive = id;
        }
      });

      if (maxRatio > 0) {
        setActive(currentActive);
      }
    }, observerOptions);

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const scrollTo = useCallback(
    (id) => {
      setMenu(false);
      const el = document.getElementById(id);

      if (!isHome) {
        // If starting from another page, navigate to home and then scroll
        // We use state to tell Home to scroll once mounted
        navigate("/", { state: { scrollTo: id } });
        return;
      }

      const lenis = lenisRef?.current;
      if (lenis && el) {
        // Use Lenis for smooth high-fidelity scroll
        lenis.scrollTo(el, { duration: 1.5 });
        setActive(id);
      } else if (el) {
        // Fallback to native
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(id);
      }
    },
    [isHome, navigate, lenisRef],
  );

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[300]"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Main navigation"
    >
      {/* Backdrop blur strip */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(5,5,5,0.85)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}
      />

      {/* Lime left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: "var(--color-lime)" }}
      />

      <div className="relative flex items-center justify-between h-14 px-6 md:px-10">
        {/* Logo / wordmark */}
        <button
          onClick={() => scrollTo("about")}
          className="font-black text-sm tracking-tighter flex items-center gap-2 group"
          style={{ color: "var(--color-chalk)" }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full group-hover:scale-125 transition-transform"
            style={{ background: "var(--color-lime)" }}
          />
          AD<span style={{ color: "var(--color-lime)" }}>.</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {SECTIONS.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              isActive={displayActive === item.id}
              onClick={scrollTo}
            />
          ))}
        </div>

        {/* CTA availability badge */}
        <div className="hidden md:flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--color-lime)" }}
          />
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: "var(--color-muted)" }}
          >
            Available
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenu((v) => !v)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-px w-5"
              style={{ background: "var(--color-chalk)", originX: 0 }}
              animate={{
                rotate:
                  menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                y: menuOpen && i === 0 ? 6 : menuOpen && i === 2 ? -6 : 0,
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: menuOpen ? "auto" : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        <div
          className="flex flex-col px-6 py-4 gap-4"
          style={{ background: "rgba(5,5,5,0.96)" }}
        >
          {SECTIONS.slice(1).map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="font-mono text-xs tracking-[0.2em] uppercase py-2"
              style={{
                color:
                  active === item.id
                    ? "var(--color-lime)"
                    : "var(--color-muted)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
