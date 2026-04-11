/**
 * MagneticButton.jsx — Reusable magnetic pull wrapper
 *
 * HOW IT WORKS:
 * 1. Track mouse position relative to the button's bounding rect.
 * 2. Calculate distance from cursor to button center.
 * 3. When cursor enters the activation radius, interpolate the button
 *    wrapper toward the cursor by a fraction (PULL strength).
 * 4. The inner content (text/icon) moves slightly MORE — creating a
 *    subtle parallax between wrapper and content that feels premium.
 * 5. On mouse leave, both spring back to origin.
 *
 * PROPS:
 * @param {React.ReactNode} children   — button content
 * @param {string}          className  — extra Tailwind classes on wrapper
 * @param {number}          strength   — pull strength [0–1], default 0.35
 * @param {function}        onClick
 */
import { useRef, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { cn } from '../../utils/cn';
import useAppStore from '../../store/useAppStore';

const SPRING = { damping: 20, stiffness: 200, mass: 0.6 };

const MagneticButton = ({
    children,
    className,
    strength = 0.35,
    onClick,
    ...rest
}) => {
    const ref = useRef(null);
    const setCursorVariant = useAppStore((s) => s.setCursorVariant);

    // Spring values for wrapper displacement
    const wrapX = useSpring(0, SPRING);
    const wrapY = useSpring(0, SPRING);

    // Inner content moves at 1.6× the wrapper — creates parallax depth
    const innerX = useSpring(0, SPRING);
    const innerY = useSpring(0, SPRING);


    const handleMouseMove = useCallback(
        (e) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;

            wrapX.set(dx * strength);
            wrapY.set(dy * strength);
            innerX.set(dx * strength * 1.6);
            innerY.set(dy * strength * 1.6);
        },
        [strength, wrapX, wrapY, innerX, innerY],
    );

    const handleMouseEnter = useCallback(() => {
        setCursorVariant('hover');
    }, [setCursorVariant]);

    const handleMouseLeave = useCallback(() => {
        setCursorVariant('default');
        wrapX.set(0);
        wrapY.set(0);
        innerX.set(0);
        innerY.set(0);
    }, [setCursorVariant, wrapX, wrapY, innerX, innerY]);

    return (
        <motion.div
            ref={ref}
            className={cn('relative inline-flex cursor-none', className)}
            style={{ x: wrapX, y: wrapY }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            {...rest}
        >
            <motion.div style={{ x: innerX, y: innerY }}>
                {children}
            </motion.div>
        </motion.div>
    );
};

export default MagneticButton;
