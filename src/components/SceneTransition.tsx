import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
export default function SceneTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const timer = setTimeout(
      () => {
        // Do not steal focus if the recipient has already begun interacting.
        if (!ref.current?.contains(document.activeElement)) {
          ref.current
            ?.querySelector<HTMLElement>("h1")
            ?.focus({ preventScroll: true });
        }
      },
      reduced ? 50 : 850,
    );
    return () => clearTimeout(timer);
  }, [reduced]);
  return (
    <motion.section
      ref={ref}
      className="scene"
      initial={{ opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 1.012 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: reduced ? 0 : -4,
        scale: reduced ? 1 : 0.988,
        transition: { duration: reduced ? 0.15 : 0.45 },
      }}
      transition={{ duration: reduced ? 0.15 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
