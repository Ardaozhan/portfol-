/**
 * Layout.jsx — Cinematic page transition wrapper
 *
 * HOW IT WORKS:
 * A dark curtain overlay is driven by Framer Motion variants.
 * On mount  → curtain sweeps DOWN from top (covering the old view), then
 *             immediately sweeps UP to reveal the new view.
 * On unmount → curtain sweeps DOWN to cover the exiting section.
 *
 * The curtain is split into TWO panels (left + right) that move with a
 * subtle timing offset, creating a premium bi-directional wipe effect.
 *
 * USAGE:
 *   Wrap any page/section content with <Layout>…</Layout>.
 *   Mount inside <AnimatePresence mode="wait"> (done in App.jsx).
 *
 * @param {React.ReactNode} children
 * @param {string}          key   — REQUIRED by AnimatePresence to detect route changes
 */
import { motion } from 'framer-motion';

// ── Curtain panel variants ────────────────────────────────────────────────────
const curtainVariants = {
    // Entry: curtain starts covering the screen (scaleY:1), then retracts (scaleY:0)
    initial: { scaleY: 1 },
    animate: {
        scaleY: 0,
        transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    // Exit: curtain re-expands to cover during unmount
    exit: {
        scaleY: 1,
        transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
    },
};

// Content fades slightly during wipe — keeps motion intentional
const contentVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.4, delay: 0.55, ease: 'easeOut' },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.25, ease: 'easeIn' },
    },
};

// ── Curtain Panel ─────────────────────────────────────────────────────────────
const CurtainPanel = ({ delay = 0 }) => (
    <motion.div
        className="fixed inset-0 z-[500] origin-top pointer-events-none"
        style={{ background: 'var(--color-void)' }}
        variants={curtainVariants}
        initial="initial"
        animate={{
            ...curtainVariants.animate,
            transition: {
                ...curtainVariants.animate.transition,
                delay,
            },
        }}
        exit="exit"
    />
);

// ── Layout Wrapper ────────────────────────────────────────────────────────────
const Layout = ({ children }) => (
    <>
        {/* Two panels with a minimal stagger for the bi-wipe feel */}
        <CurtainPanel delay={0} />
        <CurtainPanel delay={0.04} />

        {/* Page content — fades in under the rising curtain */}
        <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    </>
);

export default Layout;
