/**
 * CustomCursor.jsx — Spring-physics driven custom cursor
 *
 * STATES:
 * ┌─ 'default'   → small dot (8px)
 * ├─ 'hover'     → medium ring (40px), no fill
 * ├─ 'view'      → large filled circle with "VIEW" label (expand on card hover)
 * └─ 'hidden'    → cursor leaves viewport / over interactive native element
 *
 * WHY FRAMER MOTION SPRING (not lerp):
 * Springs give physically correct overshoot and velocity damping. `damping:28`
 * keeps it tight; `stiffness:300` makes it snappy without rigid tracking.
 * The dot and the ring are on separate spring configs so they feel decoupled.
 *
 * ARCHITECTURE:
 * - Mouse position written to Zustand store by this component
 *   (replaces the Hero mousemove — we centralise it here at the root level)
 * - cursorVariant read from the store (components call `setCursorVariant`)
 * - Rendered at root so it's always on top (z:9999)
 */
import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import useAppStore from "../../store/useAppStore";
import { cn } from "../../utils/cn";

// Spring configs
const SPRING_DOT = { damping: 30, stiffness: 400, mass: 0.5 };
const SPRING_RING = { damping: 25, stiffness: 220, mass: 0.8 };

// Cursor size/style variants
const variants = {
  default: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "rgba(232,232,232,0.9)",
    border: "0px solid transparent",
    scale: 1,
  },
  hover: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    backgroundColor: "transparent",
    border: "1.5px solid rgba(232,232,232,0.6)",
    scale: 1,
  },
  view: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    backgroundColor: "rgba(232,232,232,0.92)",
    border: "0px solid transparent",
    scale: 1,
  },
  hidden: { scale: 0, opacity: 0 },
};

const labelVariants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.15 } },
};

const CustomCursor = () => {
  const cursorVariant = useAppStore((s) => s.cursorVariant);
  const setMouse = useAppStore((s) => s.setMouse);

  // Raw motion values for instant position capture
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Dot follows tightly
  const dotX = useSpring(rawX, SPRING_DOT);
  const dotY = useSpring(rawY, SPRING_DOT);

  const [isPressed, setPressed] = useState(false);

  useEffect(() => {
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    // Framer Motion values can be written on every raw event (cheap, no
    // React re-render). The Zustand `mouse` store, however, triggers a
    // React re-render in every subscribed component (e.g. About's
    // FloatingPhoto), so we gate that update to once per animation frame
    // instead of once per native mousemove event (which can fire at
    // 100-1000Hz on high-poll-rate mice/trackpads).
    let rafId = null;
    let pendingX = 0;
    let pendingY = 0;

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      rawX.set(x);
      rawY.set(y);

      pendingX = x;
      pendingY = y;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          setMouse({
            x: pendingX / window.innerWidth - 0.5,
            y: -(pendingY / window.innerHeight) + 0.5,
          });
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [rawX, rawY, setMouse]);

  const isView = cursorVariant === "view";
  const isCurrent = variants[cursorVariant] ?? variants.default;

  return (
    <>
      {/* ── Dot (tight follower) ─────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          ...isCurrent,
          scale: isPressed ? 0.8 : isCurrent.scale,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <AnimatePresence>
          {isView && (
            <motion.span
              key="view-label"
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-void font-semibold"
              variants={labelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              VIEW
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Ring (Independent for smoother lag) ─────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-white/20"
        style={{
          x: rawX, // Use raw for lag or ringX for spring? ringX feels better.
          y: rawY,
          translateX: "-50%",
          translateY: "-50%",
          width: isView ? 88 : 42,
          height: isView ? 88 : 42,
        }}
        animate={{
          scale: isView ? 1.1 : cursorVariant === "hover" ? 1.3 : 1,
          opacity: cursorVariant === "hidden" ? 0 : 0.6,
          borderColor:
            cursorVariant === "hover"
              ? "var(--color-lime)"
              : "rgba(232,232,232,0.2)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
};

export default CustomCursor;
