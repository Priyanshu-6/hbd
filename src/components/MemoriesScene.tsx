import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { birthdayConfig } from "../config";
import { Heading, NextButton, Photo } from "./Shared";
import type { SceneProps } from "./Shared";
export default function MemoriesScene({ onNext }: SceneProps) {
  const [index, setIndex] = useState(0);
  return (
    <div className="memories-scene">
      <div className="eyebrow">THE LITTLE MOMENTS, THE BIG FEELINGS</div>
      <Heading subtitle="Some moments deserve to be kept forever.">
        Cute Memories <span className="pink">♡</span>
      </Heading>
      <div className="polaroid-area">
        <span className="floating-heart heart-one">♡</span>
        <span className="floating-heart heart-two">♡</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="polaroid"
            initial={{ opacity: 0, rotate: -7, y: 15 }}
            animate={{ opacity: 1, rotate: [-4, -2.5, -4], y: [0, -5, 0] }}
            exit={{ opacity: 0, x: 30, rotate: 7 }}
            transition={{
              opacity: { duration: 0.3 },
              rotate: { duration: 5, repeat: Infinity },
              y: { duration: 5, repeat: Infinity },
            }}
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
