import { useCallback, useEffect, useRef, useState } from "react";
import { createBlowDetector } from "../lib/blowDetection";

type Status =
  "idle" | "requesting" | "calibrating" | "listening" | "unavailable";

export function useBlowMicrophone(onBlow: () => void) {
  const [status, setStatus] = useState<Status>("idle");
  const [level, setLevel] = useState(0);
  const stream = useRef<MediaStream | null>(null);
  const context = useRef<AudioContext | null>(null);
  const frame = useRef(0);
  const generation = useRef(0);
  const busy = useRef(false);
  const callback = useRef(onBlow);
  callback.current = onBlow;

  const release = useCallback(() => {
    generation.current++;
    busy.current = false;
    cancelAnimationFrame(frame.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (context.current) void context.current.close().catch(() => {});
    context.current = null;
  }, []);

  const stop = useCallback(() => {
    release();
    setStatus("idle");
    setLevel(0);
  }, [release]);

  useEffect(() => release, [release]);

  const start = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    const request = ++generation.current;
    setStatus("requesting");
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      release();
      setStatus("unavailable");
      return;
    }
    try {
      // Construct/resume in the gesture, before the permission prompt (Safari).
      const audioContext = new AudioContext();
      context.current = audioContext;
      const resumed = audioContext.resume().catch(() => {});
      const media = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });
      if (request !== generation.current) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = media;
      await resumed;
      if (request !== generation.current) return;
      if (audioContext.state !== "running")
        throw new Error("Microphone audio unavailable");
      const source = audioContext.createMediaStreamSource(media);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser); // Never connect the mic to speakers or record it.
      const data = new Float32Array(analyser.fftSize);
      const detect = createBlowDetector(performance.now());
      setStatus("calibrating");
      let lastPaint = 0;
      const sample = (now: number) => {
        if (request !== generation.current) return;
        analyser.getFloatTimeDomainData(data);
        const rms = Math.sqrt(
          data.reduce((sum, value) => sum + value * value, 0) / data.length,
        );
        const result = detect(rms, now);
        if (result.triggered) {
          stop();
          callback.current();
          return;
        }
        if (now - lastPaint > 80) {
          setStatus(result.ready ? "listening" : "calibrating");
          setLevel(result.level);
          lastPaint = now;
        }
        frame.current = requestAnimationFrame(sample);
      };
      frame.current = requestAnimationFrame(sample);
    } catch {
      if (request !== generation.current) return;
      release();
      setLevel(0);
      setStatus("unavailable");
    }
  }, [release, stop]);

  return { status, level, start, stop };
}
