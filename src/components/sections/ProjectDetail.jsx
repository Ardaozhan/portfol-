import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { PROJECTS } from '../../data/projects';

// ── Floating Swatch Component ──────────────────────────────────────────────
const FloatingSwatch = ({ color, label, index, progress }) => {
    const y = useTransform(progress, [0, 1], [0, (index + 1) * -300]);
    const x = index % 2 === 0 ? -120 : 120;

    return (
        <motion.div
            style={{ y, x }}
            className={`absolute z-30 ${index % 2 === 0 ? 'left-[5%]' : 'right-[5%]'} hidden lg:block`}
        >
            <div className="flex flex-col gap-2 group">
                <div
                    className="w-16 h-24 rounded-sm border border-white/10 shadow-2xl transition-transform group-hover:scale-110"
                    style={{ background: color }}
                />
                <div className="font-mono text-[8px] text-white/40 uppercase tracking-tighter">
                    <p>{label}</p>
                    <p className="text-white/20">{color}</p>
                </div>
            </div>
        </motion.div>
    );
};

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const project = PROJECTS.find(p => p.id === id);
    const currentIndex = PROJECTS.findIndex(p => p.id === id);
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // ── Spotlight Effect ───────────────────────────────────────────────────
    const spotlightX = useSpring(mouseX, { stiffness: 150, damping: 25 });
    const spotlightY = useSpring(mouseY, { stiffness: 150, damping: 25 });
    const spotlightFilter = useMotionTemplate`radial-gradient(600px circle at ${spotlightX}px ${spotlightY}px, rgba(212, 245, 0, 0.08), transparent 80%)`;

    // ── Kinetic Transforms ───────────────────────────────────────────────────
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const titleX = useTransform(smoothProgress, [0, 1], ["0%", "-30%"]);
    const titleScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);
    const bgOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0.8, 0.05, 0.05, 0.8]);

    // Technical Parallax Layers
    const techY1 = useTransform(smoothProgress, [0, 1], [0, -400]);
    const techY2 = useTransform(smoothProgress, [0, 1], [0, 300]);

    useEffect(() => {
        if (project) document.title = `${project.title} // ARCHIVE`;
        window.scrollTo(0, 0);

        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        const handleDown = (e) => { if (e.key === 'Escape') navigate('/'); };
        window.addEventListener('keydown', handleDown);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleDown);
        };
    }, [project, navigate, mouseX, mouseY]);

    if (!project) return null;

    return (
        <motion.div
            ref={containerRef}
            className="relative min-h-[450vh] bg-[#020202] text-white selection:bg-lime selection:text-black overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* ── Global Effects ───────────────────────────────────────────── */}
            <motion.div className="fixed inset-0 z-[600] pointer-events-none opacity-20 contrast-[150%] brightness-75" style={{ background: spotlightFilter }} />
            <div className="fixed inset-0 z-[700] pointer-events-none opacity-[0.03] animate-noise bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* ── Floating Technical Layers ─────────────────────────────────── */}
            <motion.div style={{ y: techY1 }} className="fixed top-20 right-20 z-0 pointer-events-none opacity-10">
                <div className="font-mono text-[15vw] leading-none select-none">DATA_01</div>
            </motion.div>
            <motion.div style={{ y: techY2 }} className="fixed bottom-20 left-20 z-0 pointer-events-none opacity-10">
                <div className="font-mono text-[15vw] leading-none select-none">CODE_0X</div>
            </motion.div>

            {/* ── Fixed UI Overlay ─────────────────────────────────────────── */}
            <div className="fixed top-0 left-0 w-full h-screen z-[500] pointer-events-none p-6 md:p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start pointer-events-auto">
                    <button onClick={() => navigate('/', { state: { scrollTo: 'work' } })} className="group flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-lime group-hover:border-lime transition-colors">
                            <span className="text-white group-hover:text-black transition-colors">×</span>
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">Exit_Archive</span>
                    </button>
                    <div className="text-right font-mono">
                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Index Reference</p>
                        <p className="text-[11px] text-lime">00{project.id} // 2024</p>
                    </div>
                </div>

                <div className="flex justify-between items-end pointer-events-auto">
                    <div className="font-mono text-[10px] space-y-2">
                        <p className="opacity-20 uppercase tracking-[0.3em]">System_Log</p>
                        <div className="flex flex-col gap-1">
                            {['Initialising...', 'Decryption complete', 'Accessing vault_00' + project.id].map((text, i) => (
                                <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.2 }} className="text-white/40">
                                    {'>'} {text}
                                </motion.p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section 1: Kinetic Hero ──────────────────────────────────── */}
            <section className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <motion.div style={{ x: titleX, scale: titleScale }} className="relative z-10 select-none">
                    <h1 className="text-[30vw] font-black leading-none uppercase tracking-tighter text-transparent"
                        style={{ WebkitTextStroke: '2px rgba(255,255,255,0.05)' }}
                    >
                        {project.title}
                    </h1>
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <motion.div
                        className="max-w-2xl text-center px-6"
                        style={{ opacity: useTransform(smoothProgress, [0, 0.15], [1, 0]) }}
                    >
                        <p className="font-mono text-lime text-xs tracking-[0.6em] uppercase mb-6">Discovery Mode Activated</p>
                        <motion.h2
                            layoutId={`project-title-${project.id}`}
                            className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none"
                        >
                            {project.title}
                        </motion.h2>
                    </motion.div>
                </div>
                <motion.div
                    layoutId={`project-image-${project.id}`}
                    className="absolute inset-0 z-0 overflow-hidden"
                    style={{ opacity: bgOpacity }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <img src={project.image} alt="" className="w-full h-full object-cover grayscale brightness-50 contrast-125" />
                </motion.div>
            </section>

            {/* ── Section 2: Narrative Analysis ─────────────────────────────── */}
            <section className="relative z-10 px-6 md:px-24 mb-[40vh]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-24 items-end">
                    <div className="md:col-span-7">
                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-12">
                            <span className="font-mono text-[10px] px-3 py-1 border border-lime text-lime uppercase tracking-widest inline-block">Analysis_01</span>
                            <h3 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                                Identifying the <span className="text-lime">Core Constraint</span>
                            </h3>
                            <p className="text-xl md:text-3xl font-light text-white/60 leading-tight">
                                {project.challenge}
                            </p>
                        </motion.div>
                    </div>
                    <div className="md:col-span-5">
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 font-mono text-[11px] leading-loose text-white/40 uppercase tracking-widest">
                            {project.description}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 3: The Archive Grid (Scattered) ────────────────────── */}
            <section className="relative z-10 px-6 py-40">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-x-0 relative">
                    {/* Floating Palette Context */}
                    {project.palette?.map((c, i) => (
                        <FloatingSwatch key={i} color={c.hex} label={c.label} index={i} progress={smoothProgress} />
                    ))}

                    {project.gallery?.map((item, i) => (
                        <motion.div
                            key={i}
                            className={`relative col-span-12 ${i % 3 === 0 ? 'md:col-span-8 md:col-start-1' : i % 3 === 1 ? 'md:col-span-5 md:col-start-7' : 'md:col-span-6 md:col-start-3'} mb-40`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <div className="group relative overflow-hidden rounded-lg bg-surface/20">
                                {/* Scanline Effect */}
                                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.div
                                        className="w-full h-[2px] bg-lime/30 shadow-[0_0_15px_rgba(212,245,0,0.5)]"
                                        animate={{ y: ['-10%', '110%'] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    />
                                    <div className="absolute inset-0 bg-lime/[0.02] mix-blend-overlay" />
                                </div>

                                <img
                                    src={item.url}
                                    alt=""
                                    loading="lazy"
                                    decodings="async"
                                    className="w-full object-cover transition-transform duration-[3s] group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black to-transparent z-40">
                                    <p className="font-mono text-[10px] text-lime mb-2 opacity-60">Asset_Ref_{i}</p>
                                    <p className="text-lg font-black uppercase tracking-tighter">{item.caption}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between font-mono text-[9px] text-white/20 uppercase tracking-widest">
                                <span>File // {project.title.replace(' ', '_')}</span>
                                <span>POS_{Math.floor(Math.random() * 900 + 100)}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Section 4: Final Verification & Archive Summary ──────────── */}
            <section className="relative z-10 py-60 px-6 md:px-24 border-t border-white/5 bg-void/50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    <div className="md:col-span-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="font-mono text-[9px] text-white/20 uppercase tracking-[0.5em] space-y-8"
                        >
                            <div>
                                <p className="mb-2 text-lime">// Archive_Summary</p>
                                <p className="leading-loose">
                                    Project_ID: {project.id}<br />
                                    Timestamp: {new Date().toLocaleDateString()}<br />
                                    Classification: {project.category}
                                </p>
                            </div>
                            <div className="w-full h-px bg-white/10" />
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map(t => (
                                    <span key={t} className="px-3 py-1 border border-white/10 text-white/40">#{t.replace(' ', '_')}</span>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="md:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="font-mono text-xs text-lime uppercase tracking-[0.5em] mb-12 block">// SYSTEM_VERIFICATION</span>
                            <h3 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] mb-12">
                                {project.solution}
                            </h3>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Section 5: Immersive Next Project Transition ─────────────── */}
            <section
                className="relative h-[80vh] w-full overflow-hidden bg-black cursor-pointer group"
                onClick={() => navigate(`/work/${nextProject.id}`)}
            >
                {/* Background Preview (Blurred) */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={nextProject.image}
                        className="w-full h-full object-cover opacity-20 grayscale transition-all duration-1000 group-hover:scale-110 group-hover:opacity-40 group-hover:grayscale-0"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void" />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <span className="font-mono text-xs tracking-[0.8em] text-lime uppercase animate-pulse">
                            Next_Data_Stream // {nextProject.year}
                        </span>
                        <h4 className="text-6xl md:text-[12vw] font-black tracking-[ -0.05em] uppercase leading-none mix-blend-difference group-hover:tracking-normal transition-all duration-700">
                            {nextProject.title}
                        </h4>
                        <div className="flex items-center justify-center gap-12 mt-12 overflow-hidden">
                            <motion.div
                                className="h-px bg-white/20 w-40 origin-left"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 1 }}
                            />
                            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 group-hover:text-lime transition-colors">
                                [ Push_To_Load ]
                            </span>
                            <motion.div
                                className="h-px bg-white/20 w-40 origin-right"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 1 }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Glitch Overlay on Hover */}
                <div className="absolute inset-0 border-[20px] border-white/0 group-hover:border-lime/5 transition-all duration-500 pointer-events-none" />
            </section>

            {/* ── Minimal Global Index Return ───────────────────────────────── */}
            <footer className="py-20 bg-void flex flex-col items-center gap-8">
                <button
                    onClick={() => navigate('/', { state: { scrollTo: 'about' } })}
                    className="font-mono text-[10px] tracking-[0.6em] uppercase text-white/20 hover:text-white transition-colors"
                >
                    Return_To_Main_Frame
                </button>
                <div className="font-mono text-[8px] text-white/10 uppercase tracking-widest">
                    © 2024 Arda_Archive // All rights reserved
                </div>
            </footer>
        </motion.div>
    );
};

export default ProjectDetail;
