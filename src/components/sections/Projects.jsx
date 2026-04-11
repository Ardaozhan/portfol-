/**
 * Projects.jsx — Horizontal scroll section powered by GSAP ScrollTrigger
 *
 * ARCHITECTURE:
 * ┌─ Section wrapper  (100vh, overflow:hidden, pin target) ──────────────────┐
 * │   ┌─ Track  (flex row, width = Cards × cardWidth + gaps) ───────────────┐│
 * │   │   [Card 1]  [Card 2]  [Card 3]  [Card 4]  [Card 5]                  ││
 * │   └──────────────────────────────────────────────────────────────────────┘│
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * HOW THE SCROLL WORKS:
 * 1. The section is pinned at its natural scroll position by ScrollTrigger.
 * 2. GSAP tweens `x` on the track from 0 → -(trackWidth - viewportWidth).
 * 3. The `scrub:1` easing gives 1-second lag behind scroll — feels physical.
 * 4. Because useLenis + useGsapScroll already syncs ScrollTrigger with Lenis,
 *    this horizontal tween is automatically smooth without extra effort.
 *
 * RESIZE:
 * A ResizeObserver on the section resets and re-creates the GSAP context
 * so scroll distances recalculate correctly at any viewport size.
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useAppStore from '../../store/useAppStore';
import { PROJECTS } from '../../data/projects';

gsap.registerPlugin(ScrollTrigger);

// ── Card width constant — used in both CSS and GSAP calculation ───────────────
const CARD_VW = 38; // % of viewport width per card

// ── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index, onSelect }) => {
    const setCursorVariant = useCallback((variant) => {
        window.__setCursorVariant?.(variant);
    }, []);

    return (
        <motion.article
            className="relative flex-shrink-0 h-full overflow-hidden rounded-2xl group cursor-pointer"
            style={{ width: `${CARD_VW}vw` }}
            onMouseEnter={() => setCursorVariant('view')}
            onMouseLeave={() => setCursorVariant('default')}
            onClick={() => onSelect(project.id)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Standard Image (Direct Reveal) */}
            <motion.div
                layoutId={`project-image-${project.id}`}
                className="absolute inset-0 z-0 h-full"
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover origin-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] grayscale group-hover:grayscale-0 group-hover:scale-110"
                />

                {/* Subtle vignette for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 group-hover:opacity-20 transition-opacity duration-700" />
            </motion.div>

            <motion.div
                layoutId={`project-info-${project.id}`}
                className="absolute bottom-0 left-0 right-0 p-6 z-20"
                style={{
                    background: 'rgba(5,5,5,0.0)',
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <div
                    className="rounded-xl p-5 transition-smooth"
                    style={{
                        background: 'rgba(8,8,8,0.6)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        border: '1px solid rgba(255,255,255,0.07)',
                    }}
                >
                    <span
                        className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-2"
                        style={{ color: 'rgba(232,232,232,0.25)' }}
                    >
                        0{index + 1} / {String(PROJECTS.length).padStart(2, '0')}
                    </span>

                    <div className="overflow-hidden">
                        <motion.h3
                            layoutId={`project-title-${project.id}`}
                            className="text-2xl md:text-3xl font-black leading-tight tracking-tight"
                            style={{ color: 'var(--color-highlight)' }}
                            initial={{ y: '100%' }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {project.title}
                        </motion.h3>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <p
                            className="font-mono text-xs tracking-[0.2em] uppercase"
                            style={{ color: 'rgba(232,232,232,0.4)' }}
                        >
                            {project.category}
                        </p>
                        <span
                            className="font-mono text-xs"
                            style={{ color: 'rgba(232,232,232,0.2)' }}
                        >
                            {project.year}
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.article>
    );
};

// ── Projects Section ──────────────────────────────────────────────────────────
const Projects = () => {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const ctxRef = useRef(null);
    const navigate = useNavigate();

    const buildScroller = useCallback(() => {
        if (!sectionRef.current || !trackRef.current) return;
        ctxRef.current?.revert();
        ctxRef.current = gsap.context(() => {
            const track = trackRef.current;
            const section = sectionRef.current;
            const trackWidth = track.scrollWidth;
            const viewportWidth = window.innerWidth;
            const scrollDist = trackWidth - viewportWidth;

            gsap.to(track, {
                x: -scrollDist,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${scrollDist}`,
                    scrub: 1.2,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });
        }, sectionRef);
    }, []);

    useEffect(() => {
        const id = setTimeout(buildScroller, 150);
        return () => clearTimeout(id);
    }, [buildScroller]);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ro = new ResizeObserver(buildScroller);
        ro.observe(document.body);
        return () => {
            ro.disconnect();
            ctxRef.current?.revert();
        };
    }, [buildScroller]);

    useEffect(() => {
        window.__setCursorVariant = useAppStore.getState().setCursorVariant;
        return () => { delete window.__setCursorVariant; };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="projects"
            className="relative overflow-hidden"
            style={{ height: '100vh' }}
            aria-label="Projects horizontal scroll"
        >
            <div className="absolute top-10 left-8 z-10 pointer-events-none select-none">
                <p
                    className="font-mono text-xs tracking-[0.35em] uppercase mb-2"
                    style={{ color: 'rgba(232,232,232,0.25)' }}
                >
                    — Projects
                </p>
                <span
                    className="font-mono text-[10px] tracking-widest"
                    style={{ color: 'rgba(232,232,232,0.15)' }}
                >
                    Scroll to explore →
                </span>
            </div>

            <div
                ref={trackRef}
                className="absolute inset-y-0 left-0 flex items-center"
                style={{
                    gap: '1.25rem',
                    paddingLeft: '8rem',
                    paddingRight: '4rem',
                    width: 'max-content',
                }}
            >
                <div
                    className="flex-shrink-0 select-none pointer-events-none"
                    style={{ width: '10rem' }}
                >
                    <p
                        className="font-black leading-none tracking-tighter"
                        style={{
                            fontSize: 'clamp(6rem, 12vw, 10rem)',
                            color: 'rgba(255,255,255,0.04)',
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                        }}
                    >
                        WERK
                    </p>
                </div>

                {PROJECTS.map((project, i) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        onSelect={(id) => navigate(`/work/${id}`)}
                    />
                ))}

                <div className="flex-shrink-0 w-24" />
            </div>

            <div
                className="absolute bottom-6 left-8 right-8 h-px"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                aria-hidden="true"
            >
                <motion.div
                    className="h-full origin-left"
                    style={{ background: 'rgba(232,232,232,0.3)' }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                />
            </div>
        </section>
    );
};

export default Projects;
