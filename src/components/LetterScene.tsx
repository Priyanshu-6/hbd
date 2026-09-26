import { useEffect, useRef, useState } from "react";
import { Mail, RotateCcw, Heart } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { birthdayConfig } from "../config";
import { Heading } from "./Shared";
export default function LetterScene({ onReplay }: { onReplay: () => void }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  useEffect(() => {
    if (reduced) {
      setCount(birthdayConfig.letter.length);
      return;
    }
    if (count >= birthdayConfig.letter.length) return;
    const last = birthdayConfig.letter[count - 1];
    const timer = setTimeout(
      () => setCount((n) => n + 1),
      /[.!?\n]/.test(last ?? "") ? 200 : 28,
    );
    return () => clearTimeout(timer);
  }, [count, reduced]);
  useEffect(() => {
    if (following.current && card.current)
      card.current.scrollTop = card.current.scrollHeight;
  }, [count]);
  const done = count >= birthdayConfig.letter.length;
  return (
    <div className="letter-scene">
      <div className="letter-icon">
        <Mail size={29} strokeWidth={1} />
        <Heart size={10} />
      </div>
      <Heading subtitle="A few words from my heart to yours.">
        A Letter Just For You
      </Heading>
      <div
        className="letter-card"
        ref={card}
        tabIndex={0}
        aria-label="Your birthday letter"
        onScroll={() => {
          if (card.current)
            following.current =
              card.current.scrollHeight -
                card.current.scrollTop -
                card.current.clientHeight <
              150;
        }}
      >
        <span className="letter-date"></span>
        <p aria-hidden="true">
          {birthdayConfig.letter.slice(0, count)}
          {!done && <span className="type-cursor">|</span>}
        </p>
        <span className="sr-only">{birthdayConfig.letter}</span>
        <div className="letter-seal" aria-hidden="true">
          ♡
        </div>
      </div>
      <div className="letter-controls">
        {!done && (
          <button
            className="text-button"
            onClick={() => setCount(birthdayConfig.letter.length)}
          >
            Read the whole letter
          </button>
        )}
        <button className="pill" onClick={onReplay}>
          <RotateCcw size={13} /> Watch it again
        </button>
      </div>
    </div>
  );
}
