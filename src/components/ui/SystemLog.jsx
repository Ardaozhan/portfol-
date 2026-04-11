import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const SystemLog = () => {
    const location = useLocation();
    const [logs, setLogs] = useState(['[SYS] INITIALIZING ARCHIVE...', '[SYS] CONNECTION STABLE']);

    useEffect(() => {
        const path = location.pathname;
        let newLog = '';

        if (path === '/') newLog = '[SYS] VIEW: ROOT_DIRECTORY';
        else if (path.startsWith('/work/')) newLog = `[SYS] ACCESS: VAULT_${path.split('/').pop()}`;

        if (newLog) {
            setLogs(prev => [...prev.slice(-4), newLog]);
        }
    }, [location]);

    return (
        <div className="fixed bottom-6 left-6 z-[400] pointer-events-none hidden md:block">
            <div className="font-mono text-[9px] text-white/20 space-y-1">
                <AnimatePresence mode="popLayout">
                    {logs.map((log, i) => (
                        <motion.p
                            key={log + i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {log}
                        </motion.p>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SystemLog;
