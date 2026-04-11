import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 800);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-[250] group flex items-center gap-4 focus:outline-none"
                    onMouseEnter={() => window.__setCursorVariant?.('hover')}
                    onMouseLeave={() => window.__setCursorVariant?.('default')}
                >
                    <div className="flex flex-col items-end pointer-events-none">
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30 group-hover:text-lime transition-colors">
                            Back To Top
                        </span>
                        <span className="font-mono text-[7px] text-white/10 uppercase">Index.00</span>
                    </div>

                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-void/80 backdrop-blur-md group-hover:border-lime transition-colors">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-white group-hover:stroke-lime transition-colors">
                            <path d="M7 11V3M7 3L3 7M7 3L11 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
