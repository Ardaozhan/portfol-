/**
 * About.jsx — Kinetic typography + sticky storytelling section
 *
 * STRUCTURE (4 sticky chapters):
 * ┌── CHAPTER 0 — Intro / Identity  (sceneTheme: 'dark')
 * ├── CHAPTER 1 — Origin / Story    (sceneTheme: 'warm')
 * ├── CHAPTER 2 — Skills / Tools    (sceneTheme: 'cool')
 * └── CHAPTER 3 — Philosophy        (sceneTheme: 'neutral')
 *
 * KINETIC TEXT:
 * Every large headline word is wrapped in a <KineticWord> that reads skewX
 * from the useScrollVelocity hook. Additionally, a `stretchX` scale is
 * derived from Math.abs(velocity) so words also slightly widen at speed.
 *
 * IMAGE PARALLAX:
 * A Framer Motion spring driven by the Zustand mouse store creates a
 * "floating photo" that tilts 8° and drifts 20px in each axis.
 *
 * STICKY MECHANISM:
 * Each chapter div is `position:sticky; top:0; height:100vh`.
 * This is a pure CSS sticky stack — no GSAP pinning needed, which avoids
 * a ScrollTrigger conflict with the horiz-scroll section above.
 * ScrollTrigger is only used here for the scene color signal injection.
 */
import { useRef, useEffect } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollVelocity from "../../hooks/useScrollVelocity";
import useAppStore from "../../store/useAppStore";

gsap.registerPlugin(ScrollTrigger);

// ── Chapter data ──────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id: "identity",
    theme: "dark",
    label: "01 — Kimlik",
    headline: ["GRAFİK", "TASARIMCI"],
    sub: "Markalar için anlam taşıyan görsel diller yaratıyorum.",
    body: "İstanbul merkezli bir grafik tasarımcı ve art director olarak kurumsal kimlikten ambalaj tasarımına, editöryal yayından dijital görsel sistemlere kendi imzamı taşıyan çalışmalar üretiyorum. Benim için tasarım, sadece güzellik değil — doğru mesajın doğru formu.",
    accent: "#e8e8e8",
    img: "/img/about_cat_owner.png",
    imgLabel: "Head of Design / Site Owner",
    imgTitle: "Arda D. (The Cat)",
    itemLabel: "IDENTITY",
  },
  {
    id: "origin",
    theme: "warm",
    label: "02 — Köken",
    headline: ["MÜREKKEPten", "PİKSELE"],
    sub: "Kağıtla başlayan yolculuk, dijitalde büyüdü.",
    body: "Tasarıma kağıt ve mürekkeple başladım — elle çizim, baskı atölyeleri, ofset makinelerinin kokusu. Sonra piksele geçtim. Her medium aynı soruyu soruyordu: Bu yüzey nasıl bir şey hissettirmeli?",
    accent: "#ffb347",
    img: "/img/about_origin.png",
    imgLabel: "Analog to Digital",
    imgTitle: "Lines & Curves",
    itemLabel: "ORIGIN",
  },
  {
    id: "skills",
    theme: "cool",
    label: "03 — Araçlar",
    headline: ["HAKİMİYET", "HER ŞEYDEN ÖNCE"],
    sub: "Sürekli gelişen, mükemmeli arayan bir araç seti.",
    body: "Adobe Illustrator · InDesign · Photoshop · Figma · After Effects · Blender · Procreate · Glyphs · Pantone · Ofset Baskı. Araçlar değişir. Detaya olan takıntı değişmez.",
    accent: "#7eb8f7",
    img: "/img/about_skills.png",
    imgLabel: "Creative Arsenal",
    imgTitle: "Mastery of Tools",
    itemLabel: "SKILLS",
  },
  {
    id: "philosophy",
    theme: "neutral",
    label: "04 — Felsefe",
    headline: ["DETAY", "TASARIMIN KENDİSİDİR"],
    sub: "Amaçsız hiçbir şey yok. Rastlantısal hiçbir şey yok.",
    body: "Her seçilen font, bir cümledir. Her renk farkı, bir duygu kararıdır. Her boşluk, bilinçli bir hiyerarşi kurulumudur. Dikkat eden insanlar için dikkat ederek tasarım yapıyorum.",
    accent: "#c4b5fd",
    img: "/img/about_philosophy.png",
    imgLabel: "Modernist Logic",
    imgTitle: "The Grid",
    itemLabel: "ETHOS",
  },
];

// ── Kinetic word component ────────────────────────────────────────────────────
/**
 * Wraps a single word. Applies:
 * - skewX from useScrollVelocity (velocity-driven lean)
 * - scaleX stretch: 1 + |velocity| * 0.08 (words widen at speed)
 * - An entrance animation that slides up from below on viewport entry
 */
const KineticWord = ({ word, skewX, velocity, delay = 0, accentColor }) => {
  // Derive scaleX: at max velocity the word is 8% wider
  const scaleX = useTransform(velocity, [0, 1], [1, 1.08]);

  return (
    <span className="overflow-hidden inline-block leading-none">
      <motion.span
        className="inline-block origin-bottom-left will-change-transform font-black tracking-tighter"
        style={{
          skewX,
          scaleX,
          display: "inline-block",
          color: accentColor,
        }}
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {word}
      </motion.span>
    </span>
  );
};

// ── Kinetic headline ──────────────────────────────────────────────────────────
const KineticHeadline = ({ lines, skewX, velocity, accentColor }) => (
  <h2
    className="flex flex-col gap-1 select-none"
    style={{ fontSize: "var(--text-display-sm)" }}
  >
    {lines.map((line, li) => (
      <span key={li} className="flex gap-4 flex-wrap">
        {line.split(" ").map((word, wi) => (
          <KineticWord
            key={wi}
            word={word}
            skewX={skewX}
            velocity={velocity}
            delay={li * 0.12 + wi * 0.07}
            accentColor={accentColor}
          />
        ))}
      </span>
    ))}
  </h2>
);

// ── Floating photo component ──────────────────────────────────────────────────
const FloatingPhoto = ({ chapter }) => {
  const mouse = useAppStore((s) => s.mouse);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const translateX = useSpring(useMotionValue(0), {
    stiffness: 60,
    damping: 18,
  });
  const translateY = useSpring(useMotionValue(0), {
    stiffness: 60,
    damping: 18,
  });

  useEffect(() => {
    rotateX.set(-mouse.y * 8);
    rotateY.set(mouse.x * 8);
    translateX.set(mouse.x * 20);
    translateY.set(-mouse.y * 20);
  }, [mouse, rotateX, rotateY, translateX, translateY]);

  return (
    <motion.div
      className="relative w-full aspect-[3/4] max-w-sm overflow-hidden rounded-2xl bg-surface border border-white/10"
      style={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
        boxShadow: "0 50px 100px -20px rgba(0,0,0,0.5)",
      }}
    >
      <img
        src={chapter.img}
        alt={chapter.imgTitle}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover brightness-90 contrast-110 shadow-inner"
      />

      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-black tracking-tighter select-none opacity-20"
          style={{
            fontSize: "clamp(5rem, 15vw, 9rem)",
            color: "white",
            transform: "translateZ(40px)",
          }}
        >
          {chapter.itemLabel}
        </span>
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
          x: useTransform(translateX, (v) => -v * 0.5),
          y: useTransform(translateY, (v) => -v * 0.5),
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 p-6 z-20"
        style={{
          background: "linear-gradient(to top, rgba(5,5,5,0.95), transparent)",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          <p
            className="font-mono text-[9px] tracking-[0.3em] uppercase"
            style={{ color: "var(--color-lime)" }}
          >
            {chapter.imgLabel}
          </p>
        </div>
        <p className="font-black text-xl leading-none text-white tracking-tighter">
          {chapter.imgTitle}
        </p>
      </div>
    </motion.div>
  );
};

// ── Chapter component ─────────────────────────────────────────────────────────
const Chapter = ({ chapter, skewX, velocity }) => {
  const chapterRef = useRef(null);
  const setSceneTheme = useAppStore((s) => s.setSceneTheme);
  // Called unconditionally (Rules of Hooks) — only used when chapter.id === 'skills'
  const skillsTrackX1 = useTransform(velocity, [0, 1], [0, -200]);
  const skillsTrackX2 = useTransform(velocity, [0, 1], [-200, 0]);

  // Signal the WebGL scene to shift its light color when this chapter enters
  useEffect(() => {
    const el = chapterRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 55%",
      end: "bottom 45%",
      onEnter: () => setSceneTheme(chapter.theme),
      onEnterBack: () => setSceneTheme(chapter.theme),
    });

    return () => trigger.kill();
  }, [chapter.theme, setSceneTheme]);

  return (
    <div
      ref={chapterRef}
      className="sticky top-0 h-screen flex items-center overflow-hidden"
      style={{
        // Stack chapters in z — later chapters sit on top
        zIndex: CHAPTERS.indexOf(chapter) + 1,
        background: "var(--color-void)",
      }}
    >
      {/* Chapter background accent light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 80% 50%, ${chapter.accent}08 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* ── Left: text ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Chapter label */}
          <motion.p
            className="font-mono text-sm tracking-[0.5em] uppercase"
            style={{ color: `${chapter.accent}ee` }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {chapter.label}
          </motion.p>

          {/* Kinetic headline */}
          <KineticHeadline
            lines={chapter.headline}
            skewX={skewX}
            velocity={velocity}
            accentColor={chapter.accent}
          />

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl font-light leading-snug"
            style={{ color: "rgba(232,232,232,0.55)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {chapter.sub}
          </motion.p>

          {/* Body copy / Special Skills Layout */}
          {chapter.id === "skills" ? (
            <div className="relative py-4 overflow-hidden mask-fade-right">
              <motion.div
                className="flex gap-8 whitespace-nowrap"
                style={{ x: skillsTrackX1 }}
              >
                {chapter.body.split(" · ").map((skill, si) => (
                  <span
                    key={si}
                    className="font-mono text-xs border border-white/20 px-4 py-2 rounded-full text-white/40 group-hover:text-white group-hover:border-lime transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </motion.div>
              <motion.div
                className="flex gap-8 whitespace-nowrap mt-4"
                style={{ x: skillsTrackX2 }}
              >
                {[...chapter.body.split(" · ")].reverse().map((skill, si) => (
                  <span
                    key={si}
                    className="font-mono text-xs border border-white/20 px-4 py-2 rounded-full text-white/40"
                  >
                    {skill}
                  </span>
                ))}
              </motion.div>
            </div>
          ) : (
            <motion.p
              className="text-base leading-relaxed max-w-md"
              style={{ color: "rgba(232,232,232,0.35)" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              {chapter.body}
            </motion.p>
          )}

          {/* Accent rule */}
          <motion.div
            className="h-px w-16"
            style={{ background: chapter.accent, opacity: 0.3 }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          />
        </div>

        {/* ── Right: photo ────────────────────────────────────────────── */}
        <div className="hidden md:flex justify-center items-center">
          <FloatingPhoto chapter={chapter} />
        </div>
      </div>

      {/* Bottom border rule */}
      <div
        className="absolute bottom-0 left-8 right-8 h-px"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
    </div>
  );
};

// ── About Section ─────────────────────────────────────────────────────────────
const About = () => {
  const { skewX, velocity } = useScrollVelocity();
  // Chapters already broadcast their theme into the store on enter (see
  // Chapter's ScrollTrigger effect) — reuse that same signal to drive a
  // progress rail instead of adding a second scroll listener.
  const sceneTheme = useAppStore((s) => s.sceneTheme);
  const activeIndex = CHAPTERS.findIndex((c) => c.theme === sceneTheme);

  return (
    <section
      id="about"
      aria-label="About me"
      // Total height = 100vh per chapter (CSS sticky handles the illusion)
      style={{ position: "relative" }}
    >
      {CHAPTERS.map((chapter, i) => (
        <Chapter
          key={chapter.id}
          chapter={chapter}
          skewX={skewX}
          velocity={velocity}
          isFirst={i === 0}
        />
      ))}

      {/* Chapter progress rail — zero-height sticky anchor so it doesn't add
          extra scroll distance to the section; the accent-colored fill uses
          a shared layoutId (same technique as Navbar's active-link dot) so it
          physically slides/springs between ticks instead of just swapping
          color, then scrolls away naturally once the section ends. */}
      <div
        className="hidden lg:block sticky top-0 h-0 pointer-events-none"
        style={{ zIndex: CHAPTERS.length + 10 }}
        aria-hidden="true"
      >
        <div className="absolute right-8 xl:right-12 top-1/2 -translate-y-1/2 flex flex-col items-end gap-4">
          {CHAPTERS.map((chapter, i) => (
            <div key={chapter.id} className="flex items-center gap-3">
              <motion.span
                className="font-mono text-[9px] uppercase tracking-[0.2em]"
                animate={{
                  color:
                    i === activeIndex
                      ? chapter.accent
                      : "rgba(255,255,255,0.15)",
                  scale: i === activeIndex ? 1.15 : 1,
                }}
                transition={{ duration: 0.4 }}
              >
                0{i + 1}
              </motion.span>
              <span
                className="relative block w-5 h-[2px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                {i === activeIndex && (
                  <motion.span
                    layoutId="about-rail-active"
                    className="absolute inset-0 rounded-full"
                    style={{ background: chapter.accent }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
