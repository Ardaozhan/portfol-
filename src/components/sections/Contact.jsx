/**
 * Contact.jsx — İletişim bölümü (Grafik Tasarımcı odaklı)
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SOCIALS = [
    { label: 'Behance', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Dribbble', href: '#' },
];

const INPUT_STYLE = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--color-chalk)',
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    padding: '12px 0',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.3s',
};

const InputField = ({ label, type = 'text', name, value, onChange, required, placeholder }) => (
    <div className="flex flex-col gap-2">
        <label className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--color-muted)' }}>
            {label} {required && <span style={{ color: 'var(--color-lime)' }}>*</span>}
        </label>
        {type === 'textarea' ? (
            <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={4}
                style={{ ...INPUT_STYLE, resize: 'none' }}
                onFocus={(e) => (e.target.style.borderBottomColor = 'var(--color-lime)')}
                onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.1)')} />
        ) : (
            <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
                style={INPUT_STYLE}
                onFocus={(e) => (e.target.style.borderBottomColor = 'var(--color-lime)')}
                onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.1)')} />
        )}
    </div>
);

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', type: '', message: '' });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleChange = useCallback((e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value })), []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSending(true);
        await new Promise((r) => setTimeout(r, 900));
        setSending(false);
        setSent(true);
    }, []);

    return (
        <section id="contact" className="relative min-h-screen flex flex-col md:flex-row" aria-label="İletişim">

            {/* SOL: Büyük CTA */}
            <div className="relative flex flex-col justify-between p-8 md:p-14 md:w-1/2" style={{ borderRight: '1px solid var(--color-border)' }}>
                <div>
                    <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-8" style={{ color: 'var(--color-lime)' }}>
                        — İletişim
                    </p>
                    <h2 className="font-black tracking-tighter leading-[0.88]" style={{ fontSize: 'clamp(3rem,8vw,7rem)', color: 'var(--color-chalk)' }}>
                        BİRLİKTE<br />
                        <span style={{ color: 'var(--color-lime)' }}>ÜRETELIM</span>
                    </h2>
                    <p className="mt-6 max-w-sm text-base leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                        Yeni marka projeleri, ambalaj tasarımı, editöryal çalışmalar ve sanat yönetmenliği için açığım.
                        Genellikle <span style={{ color: 'var(--color-chalk)' }}>24 saat</span> içinde dönüş yapıyorum.
                    </p>
                </div>

                {/* Bilgi ızgarası */}
                <div className="flex flex-col gap-6 mt-12 md:mt-0">
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24 }}>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            {[
                                { label: 'E-Posta', value: 'merhaba@ardao.design' },
                                { label: 'Konum', value: 'İstanbul, TR' },
                                { label: 'Durum', value: '✦ Müsait' },
                                { label: 'Yanıt', value: '< 24 saat' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col gap-1">
                                    <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--color-muted)' }}>{label}</span>
                                    <span className="text-sm font-medium" style={{ color: 'var(--color-chalk)' }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-5 flex-wrap" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24 }}>
                        {SOCIALS.map((s) => (
                            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                                className="font-mono text-[9px] tracking-[0.2em] uppercase transition-colors nav-link-underline"
                                style={{ color: 'var(--color-muted)' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-chalk)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}>
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>

                <span className="absolute bottom-4 right-4 font-black pointer-events-none select-none"
                    style={{ fontSize: 'clamp(5rem,12vw,10rem)', color: 'rgba(212,245,0,0.03)', lineHeight: 1 }} aria-hidden="true">
                    ✉
                </span>
            </div>

            {/* SAĞ: Form */}
            <div className="relative flex items-center justify-center p-8 md:p-14 md:w-1/2 min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {sent ? (
                        <motion.div key="success" className="flex flex-col items-center justify-center gap-6 text-center"
                            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                            <motion.div className="text-7xl font-black" style={{ color: 'var(--color-lime)' }}
                                animate={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
                                ✓
                            </motion.div>
                            <h3 className="text-2xl font-black" style={{ color: 'var(--color-chalk)' }}>Mesajınız ulaştı.</h3>
                            <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>
                                En kısa sürede geri döneceğim.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form key="form" onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-8"
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
                            <InputField label="Adınız" name="name" value={form.name} onChange={handleChange} required placeholder="Ayşe Yılmaz" />
                            <InputField label="E-Posta" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="ayse@sirket.com" />
                            <InputField label="Proje Türü" name="type" value={form.type} onChange={handleChange} placeholder="Kurumsal Kimlik / Ambalaj / Editöryal / Diğer" />
                            <InputField label="Mesajınız" name="message" type="textarea" value={form.message} onChange={handleChange} required placeholder="Projenizden bahsedin…" />
                            <button type="submit" disabled={sending}
                                className="group flex items-center justify-between px-6 py-4 font-mono text-xs tracking-[0.25em] uppercase transition-all duration-300"
                                style={{ background: sending ? 'rgba(212,245,0,0.7)' : 'var(--color-lime)', color: 'var(--color-void)', fontWeight: 700 }}>
                                {sending ? 'Gönderiliyor…' : 'Gönder'}
                                <motion.span animate={{ x: sending ? 8 : 0 }} transition={{ duration: 0.4, repeat: sending ? Infinity : 0, repeatType: 'mirror' }}>
                                    →
                                </motion.span>
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Contact;
