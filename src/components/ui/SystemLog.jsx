import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const buildLog = (pathname) => {
  if (pathname === "/") return "[SYS] VIEW: ROOT_DIRECTORY";
  if (pathname.startsWith("/work/"))
    return `[SYS] ACCESS: VAULT_${pathname.split("/").pop()}`;
  return "";
};

const SystemLog = () => {
  const location = useLocation();
  const [logs, setLogs] = useState([
    "[SYS] INITIALIZING ARCHIVE...",
    "[SYS] CONNECTION STABLE",
  ]);
  // Track the last pathname we've logged, so we can append a new log line
  // during render when it changes — avoids setState-in-effect cascades.
  const [loggedPath, setLoggedPath] = useState(location.pathname);

  if (location.pathname !== loggedPath) {
    setLoggedPath(location.pathname);
    const newLog = buildLog(location.pathname);
    if (newLog) {
      setLogs((prev) => [...prev.slice(-4), newLog]);
    }
  }

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
