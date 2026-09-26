import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayConfig } from "../config";
import { Burst, Heading, NextButton } from "./Shared";
import type { SceneProps } from "./Shared";
export default function WishesScene({ onNext }: SceneProps) {
  const [popped, setPopped] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const done = popped.length === birthdayConfig.wishes.length;
  return (
    <div className="wishes-scene">
      <div className="eyebrow">A POCKETFUL OF HAPPY THOUGHTS</div>
      <Heading subtitle="Tap each balloon to reveal a little wish…">
        Pop the Wishes 🎈
      </Heading>
      <div className="balloons">
        {birthdayConfig.wishes.map((_, i) => (
          <div className="balloon-slot" key={i}>
            <AnimatePresence>
              {!popped.includes(i) && (
                <motion.button
                  className={`balloon balloon-${i % 4}`}
                  aria-label={`Pop wish balloon ${i + 1}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -12, 0],
                    rotate: [-3, 3, -3],
                  }}
                  exit={{
                    scale: 1.3,
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    y: {
                      duration: 3 + i * 0.3,
                      repeat: Infinity,
                      delay: i * 0.3,
                    },
                    rotate: { duration: 4, repeat: Infinity },
                  }}
                  onClick={() => {
                    setPopped((p) => [...p, i]);
                    setActive(i);
                  }}
                >
                  <span className="balloon-shine" />
                  <span className="balloon-heart">♡</span>
                  <span className="balloon-string" />
                </motion.button>
              )}
            </AnimatePresence>
            {popped.includes(i) && <span className="popped-star">✧</span>}
            {active === i && <Burst key={`burst-${i}`} show />}
          </div>
        ))}
      </div>
      <div className="wish-display" aria-live="polite">
        <AnimatePresence mode="wait">
          {active !== null ? (
            <motion.div
              className="wish-card"
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span>✧</span>
              {birthdayConfig.wishes[active]}
            </motion.div>
          ) : (
            <p className="tiny-note">Four wishes. All for you.</p>
          )}
        </AnimatePresence>
      </div>
      <p className="wishes-count">
        {popped.length} / {birthdayConfig.wishes.length} little wishes revealed
      </p>
      {done ? (
        <NextButton onClick={onNext}>All your wishes, with love</NextButton>
      ) : (
        <div className="button-space" />
      )}
    </div>
  );
}
