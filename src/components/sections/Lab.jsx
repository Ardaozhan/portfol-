/**
 * Lab.jsx — Grafik Tasarım Araştırmaları
 * Tasarımcı için "Oyun Alanı": Tipografi, Renk, Grid ve Web Deneyleri.
 */
import { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const EXPERIMENTS = [
    {
        id: 'typography',
        title: 'Tipografi & Hiyerarşi',
        tag: 'Harf Anatomisi',
        desc: 'Sadece okunmak için değil, hissetmek için tasarlanan harf ritimleri.',
        span: 'col-span-1 md:col-span-2 row-span-2',
        accent: '#ffffff',
        type: 'typography',
    },
    {
        id: 'color',
        title: 'Renk Teorisi',
        tag: 'CMYK & RGB',
        desc: 'Baskı pigmentleri ve pikseller arasındaki görsel algı oyunları.',
        span: 'col-span-1 row-span-1',
        accent: '#ff00ff',
        type: 'color',
    },
    {
        id: 'grid',
        title: 'Grid ve Yapı',
        tag: 'Kompozisyon',
        desc: 'Matematiksel boşlukların oluşturduğu modernist ve isviçre ekolü sistemler.',
        span: 'col-span-1 row-span-1',
        accent: '#d4f500',
        type: 'grid',
    },
    {
        id: 'poster',
        title: 'Deneysel Afiş',
        tag: 'Kural Yıkımı',
        desc: 'Sınırların aşıldığı, mesajın görsel kaosa karıştığı brutalist posterler.',
        span: 'col-span-1 md:col-span-2 row-span-1',
        accent: '#ff4500',
        type: 'poster',
    },
    {
        id: 'vector',
        title: 'Vektör Geometrisi',
        tag: 'Bézier Eğrileri',
        desc: 'Matematiksel kesinlikte inşa edilmiş ölçeklenebilir ikonografi ve illüstrasyon.',
        span: 'col-span-1 row-span-2',
        accent: '#0a84ff',
        type: 'vector',
    },
    {
        id: 'ui',
        title: 'UI Mikro-Etkileşim',
        tag: 'Web Lab',
        desc: 'Görünenin ötesinde; kodlanmış estetik ve kullanıcı deneyimi fizikleri.',
        span: 'col-span-1 row-span-1',
        accent: '#ccff00',
        type: 'ui',
    },
];

const LabTile = ({ exp }) => {
    const [hovered, setHovered] = useState(false);

    // Mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        let x = clientX - left;
        let y = clientY - top;

        // Grid snapping logic for 'grid' type
        if (exp.type === 'grid') {
            x = Math.round(x / 50) * 50;
            y = Math.round(y / 50) * 50;
        }

        mouseX.set(x);
        mouseY.set(y);
    };

    // Generic Templates
    const defaultSpotlight = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${exp.accent}30, transparent 80%)`;

    // Spotlights for specific themes
    const cmykC = useMotionTemplate`radial-gradient(200px circle at calc(${mouseX}px - 20px) calc(${mouseY}px - 15px), rgba(0, 255, 255, 0.8), transparent 70%)`;
    const cmykM = useMotionTemplate`radial-gradient(200px circle at calc(${mouseX}px + 20px) calc(${mouseY}px - 15px), rgba(255, 0, 255, 0.8), transparent 70%)`;
    const cmykY = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px calc(${mouseY}px + 20px), rgba(255, 255, 0, 0.8), transparent 70%)`;
    const uiGlass = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.4), transparent 60%)`;

    // Renders the backdrop interaction specific to the graphic design topic
    const renderEffectLayer = () => {
        switch (exp.type) {
            case 'typography':
                return (
                    <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: defaultSpotlight }}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 font-serif italic text-white transition-transform duration-[2s] group-hover:scale-150 group-hover:rotate-6">
                            <span style={{ fontSize: '20vw', letterSpacing: '-0.1em' }}>A&g</span>
                        </div>
                    </motion.div>
                );
            case 'color':
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen">
                        <motion.div className="absolute inset-0 mix-blend-screen" style={{ background: cmykC }} />
                        <motion.div className="absolute inset-0 mix-blend-screen" style={{ background: cmykM }} />
                        <motion.div className="absolute inset-0 mix-blend-screen" style={{ background: cmykY }} />
                    </div>
                );
            case 'grid':
                return (
                    <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: defaultSpotlight }}>
                        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(var(--color-lime) 1px, transparent 1px), linear-gradient(90deg, var(--color-lime) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                        <div className="absolute inset-0 border-[4px] border-[var(--color-lime)] opacity-30" />
                    </motion.div>
                );
            case 'poster':
                return (
                    <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: defaultSpotlight }}>
                        {/* High-contrast noise and distortion */}
                        <div className="absolute inset-0 opacity-60 mix-blend-color-burn bg-[#ff4500]" />
                        <div className="absolute inset-0 opacity-70 mix-blend-overlay"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                        />
                        <div className="absolute w-full h-1 bg-white/20 blur-sm top-1/2 -translate-y-1/2 rotate-12" />
                        <div className="absolute w-full h-1 bg-white/20 blur-sm top-1/3 -translate-y-1/2 -rotate-12" />
                    </motion.div>
                );
            case 'vector':
                return (
                    <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: defaultSpotlight }}>
                        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M 0 100 C 30 10, 70 90, 100 0" fill="none" stroke="#0a84ff" strokeWidth="1" strokeDasharray="2 2" />
                            <path d="M 0 50 Q 50 100, 100 50" fill="none" stroke="#0a84ff" strokeWidth="0.5" />
                            <circle cx="30" cy="10" r="1.5" fill="#fff" />
                            <circle cx="70" cy="90" r="1.5" fill="#fff" />
                            <line x1="0" y1="100" x2="30" y2="10" stroke="#fff" strokeWidth="0.2" />
                            <line x1="100" y1="0" x2="70" y2="90" stroke="#fff" strokeWidth="0.2" />
                        </svg>
                    </motion.div>
                );
            case 'ui':
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {/* Glassmorphic fluid cursor effect */}
                        <motion.div className="absolute inset-0 opacity-20 bg-white" style={{ clipPath: 'circle(150px at center)' }} />
                        <motion.div className="absolute w-[300px] h-[300px] rounded-full blur-3xl opacity-60 mix-blend-screen" style={{ background: uiGlass, top: '-150px', left: '-150px', x: mouseX, y: mouseY }} />
                        <div className="absolute inset-0 backdrop-blur-[20px]" />
                    </div>
                );
            default:
                return (
                    <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: defaultSpotlight }} />
                );
        }
    };

    return (
        <motion.div
            className={`group relative overflow-hidden bg-void cursor-none ${exp.span}`}
            style={{
                minHeight: 280,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Technical Labels */}
            <div className="absolute top-4 left-4 flex gap-2 font-mono text-[7px] text-white/10 uppercase tracking-[0.3em] pointer-events-none group-hover:text-white/40 transition-colors z-20">
                <span className="w-1 h-1 bg-current" />
                ASSET_ID: {exp.id.slice(0, 3).toUpperCase()}_0{exp.id.length}
            </div>
            <div className="absolute top-4 right-4 font-mono text-[7px] text-white/10 uppercase tracking-[0.3em] pointer-events-none group-hover:text-white/40 transition-colors z-20">
                REF_{Math.floor(Math.random() * 900)}
            </div>

            {/* Soft Ambient SVG Noise Default */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] animate-noise"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />

            {/* Custom Graphic Design Effect Layer */}
            {renderEffectLayer()}

            {/* Decorative Accent border */}
            <div className="absolute top-0 right-0 w-0 h-[3px] transition-all duration-700 ease-out group-hover:w-full z-30" style={{ background: exp.type === 'color' ? 'linear-gradient(90deg, #00ffff, #ff00ff, #ffff00)' : exp.accent !== '#050505' ? exp.accent : '#fff' }} />

            {/* Default State: Watermark */}
            <div className="absolute inset-0 flex items-center justify-center p-8 opacity-[0.03] transition-all duration-700 group-hover:scale-150 group-hover:opacity-0 pointer-events-none select-none">
                <span className="font-mono text-4xl tracking-widest uppercase font-black mix-blend-screen blur-[2px]">
                    {exp.id}
                </span>
            </div>

            {/* Hover State: Content Reveal */}
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end pointer-events-none z-10">
                {/* Background Dim for Contrast (Fade in on hover over image/color) */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

                <div className="relative overflow-hidden z-10">
                    <motion.div
                        className="flex flex-col gap-1"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: hovered ? '0%' : '100%', opacity: hovered ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="font-mono text-[10px] tracking-[0.25em] uppercase mb-1 drop-shadow-lg" style={{ color: exp.accent }}>
                            {exp.tag}
                        </span>
                        <h3 className="font-black tracking-tighter leading-none text-white drop-shadow-2xl mb-3" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
                            {exp.title}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base leading-relaxed tracking-wide drop-shadow-lg max-w-sm">
                            {exp.desc}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Hover State: Top Right Arrow */}
            <motion.div
                className="absolute top-6 right-6 pointer-events-none z-20"
                initial={{ opacity: 0, x: -10, y: 10 }}
                animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -10, y: hovered ? 0 : 10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ color: exp.accent }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
            </motion.div>
        </motion.div>
    );
};

const Lab = () => (
    <section id="lab" className="relative py-32 px-6 md:px-12 lg:px-20 min-h-screen flex flex-col justify-center" aria-label="Araştırmalar">
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-24 gap-12">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-lime)] animate-pulse" />
                        <p className="font-mono text-xs tracking-[0.4em] uppercase text-[var(--color-lime)]">
                            Tasarım Lab.
                        </p>
                    </div>
                    <h2 className="font-black tracking-tighter leading-[0.85] uppercase" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: 'var(--color-chalk)' }}>
                        Oyun<br />
                        <span className="opacity-30 italic font-mono tracking-tight lowercase" style={{ fontSize: '0.7em' }}>Alanı_</span>
                    </h2>
                </div>
                <p className="max-w-sm text-base md:text-lg leading-relaxed opacity-50 pb-2 border-l border-white/10 pl-8 font-mono">
                    Arayüzlerde, basılı yayınlarda ve markalamalarda kullandığım grafik tasarım disiplinlerinin görsel araştırmaları ve interaktif kod deneyleri.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[clamp(300px,40vh,500px)] gap-px bg-white/5 border-y border-white/10">
                {EXPERIMENTS.map((exp) => <LabTile key={exp.id} exp={exp} />)}
            </div>

            {/* Footer / CTA */}
            <div className="flex items-center justify-center mt-20">
                <a href="https://behance.net/" target="_blank" rel="noreferrer"
                    className="group relative flex items-center gap-4 font-mono text-[11px] tracking-[0.4em] uppercase transition-colors"
                    style={{ color: 'var(--color-chalk)' }}
                >
                    <span className="relative z-10">Tüm Teorik Kurguları İncele</span>
                    <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-[var(--color-lime)] scale-x-0 origin-right transition-transform duration-500 group-hover:scale-x-100 group-hover:origin-left" />
                </a>
            </div>
        </div>
    </section>
);

export default Lab;
