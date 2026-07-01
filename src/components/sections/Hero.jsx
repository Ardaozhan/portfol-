/**
 * Hero.jsx — Grafik Tasarımcı Hero Bölümü
 * Brutalist-editorial düzen, büyük display tipografi
 */
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import useAppStore from "../../store/useAppStore";

const SplitText = ({
  text,
  className,
  style,
  delay = 0,
  accentLast = false,
}) => {
  const words = text.split(" ");
  return (
    <span
      className={`inline-flex flex-wrap gap-x-[0.22em] gap-y-0 ${className ?? ""}`}
      style={style}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ overflow: "hidden", display: "inline-block", lineHeight: 1 }}
        >
          <motion.span
            style={{
              display: "inline-block",
              color:
                accentLast && wi === words.length - 1
                  ? "var(--color-lime)"
                  : undefined,
            }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.9,
              delay: delay + wi * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// Tasarımcıya ait disiplinler — teknik araçlar değil
const TICKER_ITEMS = [
  "Kurumsal Kimlik",
  "·",
  "Ambalaj Tasarımı",
  "·",
  "Tipografi",
  "·",
  "Editöryal Tasarım",
  "·",
  "Poster",
  "·",
  "Marka Stratejisi",
  "·",
  "Yayın Tasarımı",
  "·",
  "Broşür & Katalog",
  "·",
  "Logo Tasarımı",
  "·",
  "Renk Teorisi",
  "·",
  "Art Direction",
  "·",
  "Sosyal Medya Görselleri",
  "·",
];

const Hero = () => {
  const controls = useAnimation();
  const setIsLoaded = useAppStore((s) => s.setIsLoaded);

  useEffect(() => {
    controls.start("visible").then(() => setIsLoaded(true));
  }, [controls, setIsLoaded]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Technical Background ────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-grid opacity-[0.015] pointer-events-none" />

      {/* Scanning Laser Line */}
      <motion.div
        className="absolute left-0 w-full h-[1px] bg-lime/20 z-0 pointer-events-none"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Edge Metadata */}
      <div
        className="absolute top-10 left-6 md:left-12 font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] pointer-events-none"
        aria-hidden="true"
      >
        <p>Ref_PRT_2024</p>
        <p className="text-lime/40">Status: Active_Discovery</p>
      </div>
      <div
        className="absolute bottom-10 right-6 md:right-12 font-mono text-[9px] text-white/20 text-right uppercase tracking-[0.4em] pointer-events-none"
        aria-hidden="true"
      >
        <p>Loc: 41.0082° N, 28.9784° E</p>
        <p>System_Ver: 2.0.4_RC</p>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col gap-10 max-w-7xl">
        {/* System Header */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-1 bg-lime/40" />
            ))}
          </div>
          <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-white/40">
            Visual_Archive // Arda_D
          </span>
        </motion.div>

        {/* Display Heading */}
        <h1
          className="font-black tracking-tighter leading-[0.82] select-none"
          style={{ fontSize: "var(--text-hero)" }}
        >
          <div className="overflow-hidden">
            <SplitText text="GRAFİK" delay={0.2} />
          </div>
          <div className="overflow-hidden">
            <SplitText text="TASARIMCI" delay={0.35} />
          </div>
          <div className="overflow-hidden opacity-40">
            <SplitText text="& ART_DIR" delay={0.5} />
          </div>
        </h1>

        <div className="grid md:grid-cols-12 gap-12 items-end">
          <motion.div
            className="md:col-span-12 lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
              Markaları <span className="text-white">görsel sistemlere</span>{" "}
              dönüştürüyorum. Analitik bir yaklaşımla, her dökümanı birer anlam
              katmanına işliyorum.
            </p>
          </motion.div>

          <motion.div
            className="md:col-span-12 lg:col-span-7 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-6 bg-lime text-black px-10 py-5 rounded-full font-black text-sm uppercase tracking-tighter hover:scale-105 transition-transform"
            >
              Arşivi İncele
              <span className="group-hover:translate-x-2 transition-transform italic">
                →
              </span>
            </a>
            <a
              href="#contact"
              className="flex items-center gap-6 border border-white/10 px-10 py-5 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-colors"
            >
              Bağlantı Kur // Contact
            </a>
          </motion.div>
        </div>

        {/* Subject credential strip — first real photo on the site, framed
            like a case-file ID to reinforce the "Visual_Archive" concept
            already set up by the header tag above. */}
        <motion.div
          className="group flex items-center gap-5 pt-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 overflow-hidden rounded-lg border border-white/15"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/img/designer_portrait_1775764933930.png"
              alt="Arda D. stüdyosunda, elinde baskı materyalleriyle"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 grayscale-[20%] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-lime/20 group-hover:ring-lime/60 transition-all duration-500 pointer-events-none" />
          </motion.div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-lime/70 flex items-center gap-2">
              <motion.span
                className="block w-1 h-1 rounded-full bg-lime"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              Subject_Verified
            </span>
            <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors duration-500">
              Arda D. — Grafik Tasarımcı &amp; Art Director
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue — the section has no other affordance telling first-time
          visitors there's more below. */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30">
          Scroll
        </span>
        <motion.span
          className="block w-px h-8 bg-gradient-to-b from-lime/60 to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Decorative Parallax Element */}
      <motion.div
        className="absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none opacity-[0.02]"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <div className="text-[40vw] font-black leading-none uppercase select-none">
          AR_D
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
