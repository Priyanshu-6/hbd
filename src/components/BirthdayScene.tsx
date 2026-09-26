import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Wind, Mic, MicOff } from "lucide-react";
import { useBlowMicrophone } from "../hooks/useBlowMicrophone";
import { birthdayConfig } from "../config";
import { Burst, Heading, NextButton } from "./Shared";
import type { SceneProps } from "./Shared";
function Count({ value, label }: { value: number; label: string }) {
  const [shown, setShown] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1700);
      setShown(Math.floor(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);
  return (
    <div className="stat">
      <strong>{shown.toLocaleString("en-US")}</strong>
      <span>{label}</span>
    </div>
  );
}
export default function BirthdayScene({ onNext }: SceneProps) {
  const [blown, setBlown] = useState(false);
  const mic = useBlowMicrophone(() => setBlown(true));
  const micActive = ["requesting", "calibrating", "listening"].includes(
    mic.status,
  );
  const blow = () => {
    mic.stop();
    setBlown(true);
  };
  const [age] = useState(() => {
    const birth = new Date(birthdayConfig.birthDate);
    const now = new Date();
    const diff = Math.max(0, now.getTime() - birth.getTime());
    let years = now.getFullYear() - birth.getFullYear();
    if (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
    )
      years--;
    return {
      years: Math.max(0, years),
      days: Math.floor(diff / 86400000),
      minutes: Math.floor(diff / 60000),
      seconds: Math.floor(diff / 1000),
    };
  });
  return (
    <div className="birthday-scene">
      <div className="eyebrow">TODAY IS ALL ABOUT YOU</div>
      <Heading subtitle="The world has been better since you arrived ♡">
        Happy Birthday {birthdayConfig.recipientName} 🎂
      </Heading>
      <div className="stats">
        <Count value={age.years} label="YEARS" />
        <Count value={age.days} label="DAYS" />
        <Count value={age.minutes} label="MINUTES" />
        <Count value={age.seconds} label="SECONDS" />
      </div>
      <div className="cake-wrap">
        <div className={`cake-candles ${blown ? "blown" : ""}`}>
          {String(age.years)
            .split("")
            .map((digit, i) => (
              <div className="number-candle" key={i}>
                {!blown ? (
                  <span className="flame" />
                ) : (
                  <motion.span
                    className="smoke"
                    initial={{ y: 0, opacity: 0.6 }}
                    animate={{ y: -45, opacity: 0 }}
                    transition={{ duration: 1.6 }}
                  />
                )}
                <span>{digit}</span>
              </div>
            ))}
        </div>
        <div
          className="cake-art"
          role="img"
          aria-label="A burgundy birthday cake with gold number candles"
        >
          <div className="cake-top" />
          <div className="cake-body">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="cake-plate" />
        </div>
        <Burst show={blown} />
      </div>
      <p className="cake-dedication">
        To the cutest soul born in this world <span>♡</span>
      </p>
      <p className="birthday-prompt" role="status">
        {blown
          ? "Your wish is on its way to the stars ✨"
          : "Close your eyes. Make a wish."}
      </p>
      <div className="scene-action">
        {blown ? (
          <NextButton onClick={onNext}>Keep the magic going</NextButton>
        ) : (
          <div className="candle-controls">
            <button
              className="pill pink-border"
              onClick={micActive ? mic.stop : mic.start}
              aria-pressed={micActive}
            >
              {micActive ? <MicOff size={14} /> : <Mic size={14} />}
              {micActive ? "Stop microphone" : "Use microphone"}
            </button>
            <button className="pill" onClick={blow}>
              <Wind size={16} /> Blow out the candles
            </button>
          </div>
        )}
      </div>
      {!blown && micActive && (
        <div className="mic-level" aria-hidden="true">
          <span style={{ transform: `scaleX(${mic.level})` }} />
        </div>
      )}
      <p className="tiny-note" role="status">
        {blown
          ? "May this year be your most beautiful chapter."
          : mic.status === "requesting"
            ? "Allow microphone access, or use the candle button."
            : mic.status === "calibrating"
              ? "One quiet moment… getting ready to listen."
              : mic.status === "listening"
                ? "Blow gently or make a little sound near your mic."
                : mic.status === "unavailable"
                  ? "Microphone unavailable. The candle button still works."
                  : "Blow into your mic, or make a wish with a tap."}
      </p>
    </div>
  );
}
