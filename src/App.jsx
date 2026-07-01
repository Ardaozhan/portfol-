/**
 * App.jsx — Root application component
 *
 * RENDERING STACK (no WebGL canvas):
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  <CustomCursor />      fixed z:9999 — spring cursor             │
 * │  <BackgroundCanvas />  fixed z:0   — CSS animated bg            │
 * │  <Navbar />            fixed z:300 — sticky nav                 │
 * │  <AnimatePresence>                                                │
 * │    <Layout>            curtain wipe                              │
 * │      <main>                                                       │
 * │        <Hero />                                                   │
 * │        <About />                                                  │
 * │        <Projects />    horizontal scroll                          │
 * │        <Services />    numbered card grid                         │
 * │        <Lab />         experiment tiles                           │
 * │        <Portfolio />   bento archive                              │
 * │        <Contact />     split-screen form                          │
 * │      </main>                                                      │
 * └──────────────────────────────────────────────────────────────────┘
 */
import { useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
// Store
import useAppStore from "./store/useAppStore";

// Hooks
import useLenis from "./hooks/useLenis";
import useGsapScroll from "./hooks/useGsapScroll";

import BackgroundCanvas from "./components/ui/BackgroundCanvas";
import Navbar from "./components/ui/Navbar";
import CustomCursor from "./components/ui/CustomCursor";
import BackToTop from "./components/ui/BackToTop";
import Layout from "./components/Layout";
import SystemLog from "./components/ui/SystemLog";

// Sections
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Services from "./components/sections/Services";
import Lab from "./components/sections/Lab";
import Contact from "./components/sections/Contact";
import NotFound from "./pages/NotFound";

// Route-only section — code-split out of the main bundle since it's only
// needed when visiting a project detail page (/work/:id).
const ProjectDetail = lazy(() => import("./components/sections/ProjectDetail"));

// ── Loading Fallback ──────────────────────────────────────────────────────────
const LoadingFallback = () => (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    style={{ background: "var(--color-void)" }}
  >
    <p
      className="font-mono text-[10px] tracking-[0.4em] uppercase animate-pulse"
      style={{ color: "rgba(240,240,238,0.15)" }}
    >
      Loading…
    </p>
  </div>
);

/**
 * ── Home Page (Sections Stack) ────────────────────────────────────────────────
 * All sections are rendered vertically. The 'Projects' section implements
 * a horizontal scroll pin using GSAP ScrollTrigger.
 */
const Home = ({ lenisRef }) => {
  const location = useLocation();

  useEffect(() => {
    const scrollToId = location.state?.scrollTo;
    const lenis = lenisRef?.current;

    if (scrollToId && lenis) {
      const el = document.getElementById(scrollToId);
      if (el) {
        // Gentle delay to allow the new page to settle
        const tid = setTimeout(() => {
          lenis.scrollTo(el, {
            duration: 1.5,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          });
          // Pure state cleanup
          window.history.replaceState({}, document.title);
        }, 100);
        return () => clearTimeout(tid);
      }
    }
  }, [location.state, lenisRef]);

  return (
    <>
      <About />
      <Projects />
      <Services />
      <Lab />
      <Contact />
    </>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => {
  const location = useLocation();
  const theme = useAppStore((s) => s.theme);

  // ── Scroller Engine ──────────────────────────────────────────────────────────
  // Initialize Lenis + GSAP sync once at the absolute root.
  const lenisRef = useLenis();
  useGsapScroll(lenisRef);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Reset to top ONLY for project pages
  useEffect(() => {
    if (location.pathname.startsWith("/work/")) {
      lenisRef.current?.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, lenisRef]);

  return (
    <div className="relative min-h-screen bg-void text-white selection:bg-lime selection:text-black transition-colors duration-700">
      {/* ── Global Background Effects ─────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.03] animate-noise"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Global Persistence Components */}
      <CustomCursor />
      <BackgroundCanvas />
      <Navbar lenisRef={lenisRef} />
      <BackToTop lenisRef={lenisRef} />
      <SystemLog />

      {/* Page content with Route transitions */}
      <AnimatePresence mode="wait">
        <Layout key={location.pathname}>
          <main className="relative z-10 min-h-screen">
            <Suspense fallback={<LoadingFallback />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home lenisRef={lenisRef} />} />
                <Route
                  path="/work/:id"
                  element={<ProjectDetail isPage={true} />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </Layout>
      </AnimatePresence>
    </div>
  );
};

export default App;
