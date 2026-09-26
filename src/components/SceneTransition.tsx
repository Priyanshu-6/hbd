import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
export default function SceneTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      // Do not steal focus if the recipient has already begun interacting.
      if (!ref.current?.contains(document.activeElement)) {
        ref.current
          ?.querySelector<HTMLElement>("h1")
          ?.focus({ preventScroll: true });
      }
    }, 650);
    return () => clearTimeout(timer);
  }, []);
  return (
    <motion.section
      ref={ref}
      className="scene"
      initial={{ opacity: 0, y: 18, scale: 1.025 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {children}
    </motion.section>
  );
}
