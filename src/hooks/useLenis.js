/**
 * useLenis — Custom hook for Lenis smooth scroll
 *
 * WHY A CUSTOM HOOK (not a provider):
 * Initialising Lenis inside a hook gives complete control of the RAF loop,
 * which is critical when R3F also runs its own RAF. Both loops must be on the
 * SAME animation frame to prevent visual tearing between the WebGL canvas and
 * DOM elements.
 *
 * ARCHITECTURE NOTE:
 * We intentionally do NOT use `lenis.start()` inside useEffect — instead we
 * wire Lenis into the global `requestAnimationFrame` so it ticks in sync with
 * R3F's `useFrame`. This guarantees the scroll offset and the WebGL world move
 * together with zero frame lag.
 */
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import useAppStore from "../store/useAppStore";

/**
 * @returns {React.MutableRefObject<Lenis|null>} lenisRef — stable ref to the
 *   Lenis instance, safe to read inside GSAP timelines or R3F `useFrame`.
 */
const useLenis = () => {
  const lenisRef = useRef(null);
  const setScrollProgress = useAppStore((s) => s.setScrollProgress);
  const setHomeScrollY = useAppStore((s) => s.setHomeScrollY);
  // Read once via a ref: we only want the persisted value at mount time,
  // not on every store update (that would re-run the whole init effect).
  const initialHomeScrollY = useRef(useAppStore.getState().homeScrollY);

  useEffect(() => {
    const homeScrollY = initialHomeScrollY.current;
    // ── Initialise ──────────────────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.8,
      touchMultiplier: 2.5,
      infinite: false,
    });
    lenisRef.current = lenis;

    // ── Restore Scroll (Initial Only) ────────────────────────────────────────
    // Use a small timeout to ensure the DOM is ready for the jump
    if (homeScrollY > 0) {
      requestAnimationFrame(() => {
        lenis.scrollTo(homeScrollY, { immediate: true });
      });
    }

    // ── Sync Scroll Data ────────────────────────────────────────────────────
    lenis.on("scroll", ({ progress, scroll }) => {
      setScrollProgress(progress);
      setHomeScrollY(Math.round(scroll));
    });

    // ── RAF loop ────────────────────────────────────────────────────────────
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setScrollProgress, setHomeScrollY]);

  return lenisRef;
};

export default useLenis;
