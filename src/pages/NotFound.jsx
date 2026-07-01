import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="h-screen w-full flex flex-col items-center justify-center p-6 bg-void text-center">
      {/* Massive background text */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none uppercase overflow-hidden"
        aria-hidden="true"
      >
        <span className="text-[40vw] font-black tracking-tighter">404</span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-24 h-24 rounded-full border border-lime flex items-center justify-center mb-12"
        >
          <span className="text-lime font-mono text-xl">?</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">
          Sayfa <span className="text-lime">Bulunamadı</span>
        </h1>

        <p className="max-w-md text-muted font-mono text-sm tracking-wide leading-relaxed mb-12">
          Aradığınız tasarım felsefesi veya sayfa şu an bu ızgarada (grid)
          mevcut değil. Belki de henüz tasarlanmadı.
        </p>

        <motion.button
          onClick={() => navigate("/")}
          className="px-10 py-4 bg-lime text-void font-bold text-xs tracking-[0.3em] uppercase transition-transform hover:scale-105 active:scale-95"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Eve Dön
        </motion.button>
      </div>

      {/* Decorative coordinates */}
      <div
        className="absolute bottom-8 left-8 font-mono text-[9px] text-white/10 tracking-widest uppercase"
        aria-hidden="true"
      >
        Error Code: 0x404 // Lost in Space
      </div>
      <div
        className="absolute bottom-8 right-8 font-mono text-[9px] text-white/10 tracking-widest uppercase"
        aria-hidden="true"
      >
        system.status: offline
      </div>
    </section>
  );
};

export default NotFound;
