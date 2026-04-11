/**
 * useGsapScroll.js — GSAP ScrollTrigger ↔ Lenis sync hook
 *
 * WHY THIS SYNC IS CRITICAL:
 * ScrollTrigger calculates scroll positions using native window.scrollY.
 * Lenis overrides native scroll with virtual scroll — if ScrollTrigger is
 * not updated on every Lenis tick, trigger points will be calculated from
 * a stale scroll position, causing animations to fire at wrong times (jank).
 *
 * SOLUTION:
 * Register a Lenis scroll listener that calls ScrollTrigger.update() on
 * every Lenis raf tick. This keeps both systems in perfect sync.
 *
 * USAGE: Call this hook once in App.jsx (or a layout component) AFTER
 * useLenis() has been called (so the Lenis instance exists in the ref).
 */
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once at module level — safe to call multiple times
gsap.registerPlugin(ScrollTrigger);

/**
 * @param {React.MutableRefObject<import('@studio-freight/lenis').default|null>} lenisRef
 *   The Lenis instance ref returned by useLenis().
 */
const useGsapScroll = (lenisRef) => {
    useEffect(() => {
        // Wait for Lenis to be initialised
        const lenis = lenisRef?.current;
        if (!lenis) return;

        // ── Tell ScrollTrigger to use Lenis as its scroller ─────────────────
        // We proxy the scroll position from Lenis into ScrollTrigger's scroller
        // so triggers fire at the correct virtual scroll offsets.
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                if (arguments.length && lenis) {
                    // Allow ScrollTrigger to imperatively set scroll position (e.g. anchor jumps)
                    lenis.scrollTo(value, { immediate: true });
                }
                return lenis ? lenis.scroll : window.pageYOffset;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            // Vertical scroll — required by ScrollTrigger
            pinType: document.body.style.transform ? 'transform' : 'fixed',
        });

        // ── Forward Lenis ticks to ScrollTrigger ────────────────────────────
        // On each Lenis RAF tick, update ScrollTrigger so it recalculates
        // all trigger positions against the current virtual scroll offset.
        const onScroll = () => ScrollTrigger.update();
        lenis.on('scroll', onScroll);

        // ── Refresh ScrollTrigger after proxy is set ─────────────────────────
        ScrollTrigger.addEventListener('refresh', () => lenis.resize());
        ScrollTrigger.refresh();

        return () => {
            lenis.off('scroll', onScroll);
            ScrollTrigger.clearScrollMemory();
        };
    }, [lenisRef]);

    // Expose gsap and ScrollTrigger for convenience so callers don't need
    // to re-import them — they get the already-registered instance.
    return { gsap, ScrollTrigger };
};

export default useGsapScroll;
