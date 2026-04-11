/**
 * Services.jsx — Premium Graphic Design Services
 * Asymmetric Bento Grid + High-contrast Brutalist Invert Hover Effect
 */
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const SERVICES = [
    {
        num: '01',
        title: 'Kurumsal Kimlik',
        sub: 'Sistemsel',
        desc: 'Markanızın ruhunu görsel bir dile çeviriyorum. Logo, renk paleti, tipografi sistemi, kullanım kılavuzu ve tüm temas noktalarında tutarlı bir kimlik.',
        tags: ['Logo', 'Renk Sistemi', 'Tipografi', 'Kılavuz'],
        span: 'md:col-span-2', // Bento span
        icon: 'M12 2L2 22h20L12 2z', // Triangle
    },
    {
        num: '02',
        title: 'Ambalaj Tasarımı',
        sub: 'Fiziksel',
        desc: 'Rafta fark yaratan ambalaj çözümleri. Matbaa baskı dosyaları, 3D önizleme.',
        tags: ['Kutu', 'Baskı Hazırlık'],
        span: 'md:col-span-1',
        icon: 'M4 4h16v16H4z', // Square
    },
    {
        num: '03',
        title: 'Editöryal & Yayın',
        sub: 'Basılı',
        desc: 'Grid sistemleri ve tipografik hiyerarşiyle dergi, katalog, kitap tasarımı.',
        tags: ['Katalog', 'Dergi', 'Kitap'],
        span: 'md:col-span-1',
        icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z', // Circle
    },
    {
        num: '04',
        title: 'Poster & İllüstrasyon',
        sub: 'Yaratıcı',
        desc: 'Duvardan dijitale, mekan ve etkinlik için sanatsal afişler ve deneysel tipografi.',
        tags: ['Poster', 'Vektör'],
        span: 'md:col-span-1',
        icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', // Star
    },
    {
        num: '05',
        title: 'Dijital Görseller',
        sub: 'Dijital',
        desc: 'Sosyal medya şablonları, banner tasarımları ve markaya özel dijital kampanyalar.',
        tags: ['Sosyal Medya', 'Banner'],
        span: 'md:col-span-1',
        icon: 'M2 12h20M12 2v20', // Cross
    },
    {
        num: '06',
        title: 'Art Direction',
        sub: 'Stratejik',
        desc: 'Proje bazında sanat yönetmenliği. Konsept geliştirme ve bütünsel yaratıcı süreç yönetimi.',
        tags: ['Konsept', 'Yönetim'],
        span: 'md:col-span-2',
        icon: 'M2 2L22 22M22 2L2 22', // X
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const ServiceCard = ({ svc }) => {
    // Mouse tracking for subtle glow/parallax effect on the background number
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const transformY = useMotionTemplate`calc(-50% + ${mouseY}px)`;
    const transformX = useMotionTemplate`calc(0% + ${mouseX}px)`;

    const handleMouseMove = (e) => {
        const { currentTarget, clientX, clientY } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - left - width / 2) * 0.1;
        const y = (clientY - top - height / 2) * 0.1;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.article
            className={`group relative flex flex-col justify-between overflow-hidden p-8 md:p-10 transition-all duration-700 hover:shadow-2xl hover:-translate-y-1 ${svc.span}`}
            style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-chalk)'
            }}
            variants={cardVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Technical Metadata Labels */}
            <div className="absolute top-4 left-4 font-mono text-[8px] text-white/10 uppercase tracking-[0.2em] pointer-events-none group-hover:text-lime/40 transition-colors">
                // SV_TYPE_{svc.num}
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[8px] text-white/10 uppercase tracking-[0.2em] pointer-events-none group-hover:text-lime/40 transition-colors">
                COORD: {Math.floor(Math.random() * 90)}.{svc.num}X
            </div>

            {/* Massive background number (moves slightly with mouse) */}
            <motion.div
                className="absolute right-[-5%] top-[45%] pointer-events-none select-none font-black opacity-5 group-hover:opacity-100 transition-all duration-700"
                style={{
                    fontSize: 'clamp(12rem, 25vw, 20rem)',
                    lineHeight: 1,
                    y: transformY,
                    x: transformX,
                    WebkitTextStroke: '1px var(--color-lime)', // Hollow stroke effect on hover
                    color: 'transparent' // Make fill transparent so only shows
                }}
            >
                <span className="transition-all duration-700 group-hover:opacity-100" style={{
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                }}>
                    <span className="absolute inset-0 transition-colors duration-700 text-white/5 group-hover:text-transparent">
                        {svc.num}
                    </span>
                    {svc.num}
                </span>
            </motion.div>

            {/* Top Bar: Sub & Icon */}
            <div className="flex items-start justify-between relative z-10 mb-20 transition-all duration-500">
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40 group-hover:text-lime transition-colors duration-500">
                    {svc.sub}
                </span>

                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 opacity-20 group-hover:opacity-100 group-hover:text-lime transform transition-all duration-700 group-hover:rotate-180 group-hover:scale-110">
                    <path strokeLinecap="round" strokeLinejoin="round" d={svc.icon} />
                </svg>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10">
                <h3 className="font-black leading-none tracking-tighter mb-4 transition-transform duration-500 origin-left group-hover:scale-[1.03] uppercase italic"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                    {svc.title}
                </h3>

                <p className="text-sm md:text-base leading-relaxed opacity-40 group-hover:opacity-80 transition-all duration-500 max-w-sm">
                    {svc.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8">
                    {svc.tags.map((t) => (
                        <span key={t} className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/5 group-hover:border-lime/30 group-hover:text-lime transition-all duration-500">
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* Side-loading progress line on hover */}
            <div className="absolute left-0 bottom-0 h-0 w-[2px] bg-lime transition-all duration-700 group-hover:h-full origin-bottom" />
        </motion.article>
    );
};

const Services = () => (
    <section id="services" className="relative min-h-screen py-32 px-6 md:px-12 lg:px-20 flex items-center" aria-label="Hizmetler">
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-24 gap-12">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-lime)] animate-pulse" />
                        <p className="font-mono text-xs tracking-[0.4em] uppercase text-[var(--color-lime)]">
                            Uzmanlık Alanlarım
                        </p>
                    </div>
                    <h2 className="font-black tracking-tighter leading-[0.85] uppercase" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: 'var(--color-chalk)' }}>
                        Neler<br />
                        <span className="opacity-30 italic font-mono tracking-tight lowercase" style={{ fontSize: '0.7em' }}>Yaparım_</span>
                    </h2>
                </div>
                <p className="max-w-sm text-base md:text-lg leading-relaxed opacity-50 pb-2 border-l border-white/10 pl-8 font-mono">
                    A'dan Z'ye marka kimliği inşasından, ince detaylı editöryal baskı süreçlerine kadar kapsamlı sanat yönetmenliği ve dijital strateji.
                </p>
            </div>

            {/* Bento Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border-y border-white/10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                transition={{ staggerChildren: 0.1 }}
            >
                {SERVICES.map((svc) => <ServiceCard key={svc.num} svc={svc} />)}
            </motion.div>
        </div>
    </section>
);

export default Services;
