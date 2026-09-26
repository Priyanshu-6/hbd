import { useCallback, useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";
import { birthdayConfig } from "../config";
export default function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const fade = useRef(0);
  const optedOut = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const start = useCallback(async () => {
    if (!audio.current || optedOut.current) return;
    try {
      const el = audio.current;
      if (!el.paused) return;
      el.volume = 0;
      await el.play();
      setPlaying(true);
      cancelAnimationFrame(fade.current);
      const begin = performance.now();
      const tick = (time: number) => {
        el.volume = Math.max(0, Math.min(0.4, ((time - begin) / 2500) * 0.4));
        if (el.volume < 0.4) fade.current = requestAnimationFrame(tick);
      };
      fade.current = requestAnimationFrame(tick);
    } catch {
      setPlaying(false);
    }
  }, []);
  useEffect(() => {
    void start();
    const interact = () => {
      void start();
    };
    window.addEventListener("pointerdown", interact);
    window.addEventListener("keydown", interact);
    return () => {
      window.removeEventListener("pointerdown", interact);
      window.removeEventListener("keydown", interact);
      cancelAnimationFrame(fade.current);
    };
  }, [start]);
  const toggle = () => {
    if (!audio.current) return;
    if (playing) {
      optedOut.current = true;
      cancelAnimationFrame(fade.current);
      audio.current.pause();
      setPlaying(false);
    } else {
      optedOut.current = false;
      void start();
    }
  };
  return (
    <>
      <audio
        ref={audio}
        src={birthdayConfig.song}
        loop
        preload="auto"
        onError={() => {
          setUnavailable(true);
          setPlaying(false);
        }}
      />
      <button
        className={`music-button ${playing ? "playing" : ""}`}
        onClick={toggle}
        aria-label={
          unavailable
            ? "Background song unavailable"
            : playing
              ? "Mute music"
              : "Play music"
        }
        aria-pressed={playing}
        title={
          unavailable
            ? "Add your song in public/audio/birthday-song.mp3"
            : playing
              ? "Music on"
              : "Music off"
        }
        disabled={unavailable}
      >
        {playing ? <Music2 size={17} /> : <VolumeX size={17} />}
        <span className="music-waves" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
    </>
  );
}
