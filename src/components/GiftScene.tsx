import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Burst, Heading } from "./Shared";
import type { SceneProps } from "./Shared";
export default function GiftScene({ onNext }: SceneProps) {
  const [opening, setOpening] = useState(false);
  const [missing, setMissing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const open = () => {
    if (opening) return;
    setOpening(true);
    timer.current = setTimeout(onNext, 1500);
  };
  return (
    <div className="gift-scene">
      <div className="eyebrow">
        <span /> A LITTLE MAGIC, JUST FOR YOU <span />
      </div>
      <Heading subtitle="Something special, just for you">
        A surprise awaits you<span className="title-sparkle"> ✧</span>
      </Heading>
      <motion.button
        aria-label="Open your surprise gift"
        className={`gift-button ${opening ? "opening" : ""}`}
        onClick={open}
        disabled={opening}
        animate={
          opening
            ? {
                rotate: [0, -7, 7, -7, 6, 0],
                scale: [1, 1.04, 1, 1.1, 1.2],
                y: -15,
                opacity: [1, 1, 1, 1, 0],
              }
            : { y: [0, -7, 0], rotate: [-1, 1, -1] }
        }
        transition={
          opening
            ? { duration: 1.3 }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
        whileHover={!opening ? { scale: 1.06 } : undefined}
      >
        <span className="gift-halo" />
        <span className="gift-orbit orbit-one" />
        <span className="gift-orbit orbit-two" />
        {missing ? (
          <span className="gift-emoji">🎁</span>
        ) : (
          <span className="gift-art-stack">
            <img
              className="gift-art gift-base"
              src="/images/gift.png"
              alt="A midnight purple gift tied with a golden bow"
              onError={() => setMissing(true)}
              draggable={false}
            />
            <motion.img
              className="gift-art gift-lid"
              src="/images/gift.png"
              alt=""
              aria-hidden="true"
              draggable={false}
              animate={opening ? { y: -65, rotate: -12 } : { y: 0, rotate: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
            />
            {opening && (
              <motion.span
                className="gift-light"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], scale: 2.2 }}
                transition={{ delay: 0.4, duration: 1 }}
              />
            )}
          </span>
        )}
        <span className="gift-glint glint-one">✦</span>
        <span className="gift-glint glint-two">✧</span>
        <span className="gift-glint glint-three">✦</span>
      </motion.button>
      <Burst show={opening} />
      <p className="gift-instruction">
        {opening ? "A little magic is unfolding…" : "Tap the gift to open"}{" "}
        {!opening && <Sparkles size={14} />}
      </p>
      <p className="tiny-note">
        made with brain. sealed with a little surprise.
      </p>
    </div>
  );
}
