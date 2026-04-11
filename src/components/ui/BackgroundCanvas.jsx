/**
 * BackgroundCanvas.jsx — Animated CSS background system (no WebGL)
 *
 * Three layers stacked:
 * 1. Void base (#050505)
 * 2. Slow radial gradient blob that drifts & hue-shifts — gives life
 *    without a GPU canvas. Uses CSS @keyframes on filter:hue-rotate.
 * 3. SVG fractal noise grain overlay — adds texture and depth.
 *
 * Reads `sceneTheme` from Zustand to tint the gradient blob per section.
 */
import { useEffect, useRef } from 'react';
import useAppStore from '../../store/useAppStore';

// Theme → gradient stop colours (used as CSS custom properties)
const THEME_COLORS = {
    dark: ['#1a1a2e', '#0a0a15'],
    warm: ['#2a1a0a', '#1a0a00'],
    cool: ['#0a1a2e', '#000a1a'],
    neutral: ['#1a1020', '#0a0815'],
};

const BackgroundCanvas = () => {
    const blobRef = useRef(null);
    const prevTheme = useRef('dark');

    useEffect(() => {
        // Subscribe to sceneTheme changes and morph the blob colours
        const unsub = useAppStore.subscribe(
            (state) => state.sceneTheme,
            (theme) => {
                if (theme === prevTheme.current || !blobRef.current) return;
                prevTheme.current = theme;
                const [a, b] = THEME_COLORS[theme] ?? THEME_COLORS.dark;
                blobRef.current.style.setProperty('--blob-a', a);
                blobRef.current.style.setProperty('--blob-b', b);
            },
        );
        return unsub;
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        >
            {/* ── Layer 1: Animated radial blob ─────────────────────────────── */}
            <div
                ref={blobRef}
                className="absolute inset-0"
                style={{
                    '--blob-a': '#1a1a2e',
                    '--blob-b': '#0a0a15',
                    background: `
            radial-gradient(ellipse 70% 55% at 65% 40%, var(--blob-a) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 20% 70%, var(--blob-b) 0%, transparent 70%),
            #050505
          `,
                    transition: '--blob-a 1.8s ease, --blob-b 1.8s ease',
                    animation: 'blobDrift 18s ease-in-out infinite alternate',
                }}
            />

            {/* ── Layer 2: Structural grid lines ────────────────────────────── */}
            <div
                className="absolute inset-0 bg-grid opacity-[0.03]"
                style={{ backgroundSize: '100px 100px' }}
            />

            {/* ── Layer 3: SVG fractal noise grain ──────────────────────────── */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '300px 300px',
                    opacity: 0.032,
                    mixBlendMode: 'overlay',
                }}
            />

            {/* Blob drift keyframes injected inline to avoid CSS file coupling */}
            <style>{`
        @keyframes blobDrift {
          0%   { filter: hue-rotate(0deg);   background-position: 65% 40%; }
          33%  { filter: hue-rotate(15deg);  }
          66%  { filter: hue-rotate(-10deg); }
          100% { filter: hue-rotate(5deg);   background-position: 60% 45%; }
        }
      `}</style>
        </div>
    );
};

export default BackgroundCanvas;
