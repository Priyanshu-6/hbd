import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
export type SceneProps = { onNext: () => void };
export function Heading({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="scene-heading">
      <h1 tabIndex={-1}>{children}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
export function NextButton({
  onClick,
  children = "The next little surprise",
  disabled = false,
}: {
  onClick: () => void;
  children?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <motion.button
      className="pill"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
      <ArrowRight size={14} />
    </motion.button>
  );
}
export function Burst({ show }: { show: boolean }) {
  return (
    show && (
      <div className="burst" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <motion.i
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(i * 2.4) * (100 + i * 5),
              y: Math.sin(i * 2.4) * (100 + i * 4),
              opacity: 0,
              scale: 0,
              rotate: 200,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              delay: (i % 3) * 0.03,
            }}
            style={{ background: ["#ebc777", "#75ffaa", "#e79ab5"][i % 3] }}
          />
        ))}
      </div>
    )
  );
}
export function Photo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`photo ${className}`}>
      <div className="photo-fallback" aria-hidden="true">
        <Heart size={34} strokeWidth={1} />
        <span>a moment to treasure</span>
      </div>
      <img
        src={src}
        alt={alt}
        draggable={false}
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />
    </div>
  );
}
