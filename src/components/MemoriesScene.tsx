import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { birthdayConfig } from "../config";
import { Heading, NextButton, Photo } from "./Shared";
import type { SceneProps } from "./Shared";
export default function MemoriesScene({ onNext }: SceneProps) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div className="memories-scene">
      <div className="eyebrow">THE LITTLE MOMENTS;</div>
      <Heading subtitle="Some moments deserve to be kept forever.">
        Cute Memories <span className="pink">♡</span>
      </Heading>
      <div className="polaroid-area">
        <span className="floating-heart heart-one">♡</span>
        <span className="floating-heart heart-two">♡</span>
        <motion.div
          className="polaroid-float"
          animate={
            reduced ? { rotate: -4 } : { rotate: [-4, -2.5, -4], y: [0, -5, 0] }
          }
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className="polaroid"
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: reduced ? 0.1 : 0.28, ease: "easeInOut" }}
            >
              <span className="photo-tape" />
              <Photo
                src={birthdayConfig.memories[index]}
                alt={`Birthday memory ${index + 1}`}
              />
              <p>
                {birthdayConfig.memoryCaptions[index] ??
                  "A little moment, a lot of love ♡"}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="memory-dots">
        {birthdayConfig.memories.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={i === index ? "active" : ""}
            aria-label={`View memory ${i + 1}`}
            aria-pressed={i === index}
          />
        ))}
      </div>
      <NextButton
        onClick={
          index < birthdayConfig.memories.length - 1
            ? () => setIndex(index + 1)
            : onNext
        }
      >
        {index < birthdayConfig.memories.length - 1
          ? "One more little memory"
          : "Next Surprise"}
        <Heart size={12} />
      </NextButton>
    </div>
  );
}
