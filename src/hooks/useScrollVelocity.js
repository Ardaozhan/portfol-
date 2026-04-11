/**
 * useScrollVelocity.js — GSAP scroll velocity tracker
 *
 * WHAT IT RETURNS:
 * - `skewX`    → a MotionValue representing degrees of CSS skewX transform.
 *               Scales with scroll velocity, springs back to 0 on stop.
 * - `velocity` → a MotionValue of the raw normalised velocity [0, 1].
 *
 * HOW SKEW WORKS:
 * ScrollTrigger.getVelocity() returns px/s. We:
 * 1. Clamp and normalise it to [-1, 1].
 * 2. Multiply by MAX_SKEW degrees.
 * 3. Feed it into a Framer Motion spring MotionValue — the spring naturally
 *    produces the elastic "snap back" without any manual easing code.
 *
 * WHY GSAP VELOCITY (not a manual delta):
 * ScrollTrigger.getVelocity() samples at 60Hz internally and handles all
 * edge cases (touch momentum, wheel coasting, programmatic scroll). DIY
 * `scrollY - prevScrollY` approaches miss sub-frame velocity.
 *
 * USAGE:
 *   const { skewX, velocity } = useScrollVelocity();
 *   <motion.div style={{ skewX }} />
 */
import { useEffect } from 'react';
import { useSpring, useMotionValue } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const MAX_SKEW = 18;   // degrees — maximum lean at peak velocity
const CLAMP_VEL = 2500; // px/s — velocity at which skew is maxed out
const SPRING_CFG = { stiffness: 160, damping: 28, mass: 0.6 };

const useScrollVelocity = () => {
    // Raw target skew (updated imperatively, no React render)
    const rawSkew = useMotionValue(0);
    const rawVelocity = useMotionValue(0);

    // Spring wraps the raw value so stopping produces elastic bounce-back
    const skewX = useSpring(rawSkew, SPRING_CFG);
    const velocity = useSpring(rawVelocity, { stiffness: 100, damping: 20 });

    useEffect(() => {
        let lastY = window.scrollY;

        // Poll window.scrollY on every GSAP ticker frame to calculate real velocity
        const onTick = (time, deltaTime) => {
            const currentY = window.scrollY;

            // Avoid division by zero on very first frame or 0 delta
            const dtSec = (deltaTime > 0 ? deltaTime : 16.66) / 1000;
            const vel = (currentY - lastY) / dtSec; // px/s
            lastY = currentY;

            const norm = Math.max(-1, Math.min(1, vel / CLAMP_VEL)); // normalise [-1,1]
            rawSkew.set(norm * MAX_SKEW);
            rawVelocity.set(Math.abs(norm));
        };

        gsap.ticker.add(onTick);
        return () => gsap.ticker.remove(onTick);
    }, [rawSkew, rawVelocity]);

    return { skewX, velocity };
};

export default useScrollVelocity;
