import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Delete, LockKeyhole, LockKeyholeOpen, Heart } from "lucide-react";
import { birthdayConfig } from "../config";
import type { SceneProps } from "./Shared";
export default function PasscodeScene({ onNext }: SceneProps) {
  const [digits, setDigits] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enter = useCallback(
    (key: string) => {
      if (status !== "idle") return;
      if (key === "Backspace") setDigits((d) => d.slice(0, -1));
      else if (/^\d$/.test(key))
        setDigits((d) =>
          d.length < birthdayConfig.birthdayCode.length ? d + key : d,
        );
    },
    [status],
  );
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key) || e.key === "Backspace") {
        e.preventDefault();
        enter(e.key);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [enter]);
  useEffect(() => {
    if (digits.length !== birthdayConfig.birthdayCode.length) return;
    const correct = digits === birthdayConfig.birthdayCode;
    setStatus(correct ? "success" : "error");
    timer.current = setTimeout(
      () => {
        if (correct) onNext();
        else {
          setDigits("");
          setStatus("idle");
        }
      },
      correct ? 1000 : 650,
    );
    return () => clearTimeout(timer.current);
  }, [digits, onNext]);
  return (
    <>
      <div className="eyebrow">FOR YOUR EYES ONLY</div>
      <motion.div
        className={`phone-panel ${status}`}
        animate={status === "error" ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      >
        <div className="phone-notch" />
        <time className="lock-clock">
          {new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        <p className="lock-caption">Birthday Surprise 🎂</p>
        <div className="lock-symbol">
          {status === "success" ? (
            <LockKeyholeOpen size={19} />
          ) : (
            <LockKeyhole size={19} />
          )}
        </div>
        <h1 className="lock-title">
          {status === "success"
            ? "You have the key to my heart"
            : "Enter the secret code"}
        </h1>
        <div
          className="passcode-dots"
          aria-label={`${digits.length} of ${birthdayConfig.birthdayCode.length} digits entered`}
        >
          {Array.from(
            { length: birthdayConfig.birthdayCode.length },
            (_, i) => (
              <span key={i} className={digits.length > i ? "filled" : ""} />
            ),
          )}
        </div>
        <div className="keypad">
          {[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "",
            "0",
            "Backspace",
          ].map((key, i) =>
            key ? (
              <button
                key={key}
                onClick={() => enter(key)}
                disabled={status !== "idle"}
                aria-label={key === "Backspace" ? "Delete last digit" : key}
              >
                {key === "Backspace" ? <Delete size={18} /> : key}
              </button>
            ) : (
              <span key={`empty-${i}`} />
            ),
          )}
        </div>
        <p className="code-hint" role="status">
          {status === "error"
            ? "Not quite, love. Try again."
            : "Hint: the year your story began"}
        </p>
        <div className="phone-home" />
      </motion.div>
      <p className="under-note">
        <Heart size={11} /> Some things are meant only for you.
      </p>
    </>
  );
}
