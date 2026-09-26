import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Sparkles } from "lucide-react";
import { birthdayConfig } from "../config";
import { Burst, Heading, NextButton } from "./Shared";
import type { SceneProps } from "./Shared";
export default function ScratchCardScene({ onNext }: SceneProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const samples = useRef(0);
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d", { willReadFrequently: true })!;
    const gradient = ctx.createLinearGradient(0, 0, 640, 360);
    gradient.addColorStop(0, "#98703a");
    gradient.addColorStop(0.25, "#e2c07c");
    gradient.addColorStop(0.5, "#f0dba0");
    gradient.addColorStop(0.75, "#c69a55");
    gradient.addColorStop(1, "#e3c388");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 360);
    for (let i = 0; i < 6000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "#ffffff12" : "#5d310910";
      ctx.fillRect(
        Math.random() * 640,
        Math.random() * 360,
        1 + Math.random() * 2,
        1,
      );
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#664722";
    ctx.font = "28px Georgia";
    ctx.fillText("✧", 320, 136);
    ctx.font = "italic 26px Georgia";
    ctx.fillText("A little happiness is hiding here", 320, 196);
    ctx.font = "15px sans-serif";
    ctx.fillText("SCRATCH TO DISCOVER", 320, 239);
  }, []);
  const reveal = () => {
    setProgress(100);
    setRevealed(true);
    dragging.current = false;
  };
  const measure = () => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, 640, 360).data;
    let clear = 0,
      total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] < 100) clear++;
    }
    const percent = Math.round((clear / total) * 100);
    setProgress(percent);
    if (percent >= 55) reveal();
  };
  const scratch = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current || revealed) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * 640) / rect.width,
      y = ((e.clientY - rect.top) * 360) / rect.height;
    const ctx = el.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = (62 * 640) / rect.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(previous.current?.x ?? x, previous.current?.y ?? y);
    ctx.lineTo(x, y);
    ctx.stroke();
    previous.current = { x, y };
    if (++samples.current % 4 === 0) measure();
  };
  return (
    <div className="scratch-scene">
      <div className="eyebrow">SAVED SOMETHING SWEET FOR LAST</div>
      <Heading subtitle="Scratch the golden card to reveal!">
        One Last Surprise ✨
      </Heading>
      <div className={`scratch-card ${revealed ? "revealed" : ""}`}>
        <div className="scratch-message">
          <img
            src={birthdayConfig.scratchImage}
            alt=""
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span>♡</span>
          <h2>{birthdayConfig.scratchTitle}</h2>
          <p>{birthdayConfig.scratchMessage}</p>
        </div>
        <canvas
          width={640}
          height={360}
          ref={canvas}
          aria-label="Scratch the golden card to reveal your birthday message"
          onPointerDown={(e) => {
            if (revealed) return;
            dragging.current = true;
            previous.current = null;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratch(e);
          }}
          onPointerMove={scratch}
          onPointerUp={() => {
            dragging.current = false;
            previous.current = null;
            measure();
          }}
          onPointerCancel={() => {
            dragging.current = false;
            previous.current = null;
            measure();
          }}
        />
        <Burst show={revealed} />
      </div>
      <div
        className="scratch-progress"
        role="progressbar"
        aria-label="Card scratched"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div style={{ width: `${progress}%` }} />
      </div>
      <p className="scratch-status" role="status">
        {revealed
          ? "A little reminder of how loved you are."
          : `${progress}% of the magic uncovered`}
      </p>
      <div className="scene-action">
        {revealed ? (
          <NextButton onClick={onNext}>There’s a letter for you</NextButton>
        ) : (
          <button className="text-button" onClick={reveal}>
            <Sparkles size={12} /> Or tap to reveal
          </button>
        )}
      </div>
    </div>
  );
}
