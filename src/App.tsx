import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { ArrowLeft, Heart, X } from "lucide-react";
import { SHOW_PREVIEW_UI } from "./config";
import { useExperienceTool } from "./lib/useExperienceTool";
import StarBackground from "./components/StarBackground";
import MusicPlayer from "./components/MusicPlayer";
import GiftScene from "./components/GiftScene";
import PasscodeScene from "./components/PasscodeScene";
import IntroMessageScene from "./components/IntroMessageScene";
import BirthdayScene from "./components/BirthdayScene";
import MemoriesScene from "./components/MemoriesScene";
import WishesScene from "./components/WishesScene";
import PuzzleScene from "./components/PuzzleScene";
import ScratchCardScene from "./components/ScratchCardScene";
import LetterScene from "./components/LetterScene";
import SceneTransition from "./components/SceneTransition";
const scenes = [
  GiftScene,
  PasscodeScene,
  IntroMessageScene,
  BirthdayScene,
  MemoriesScene,
  WishesScene,
  PuzzleScene,
  ScratchCardScene,
];
const names = [
  "A little surprise",
  "The secret code",
  "Just for you",
  "Make a wish",
  "Our little memories",
  "Wishes for you",
  "Piece by piece",
  "One last surprise",
  "From my heart",
];
export default function App() {
  const [currentScene, setCurrentScene] = useState(0);
  const [replay, setReplay] = useState(0);
  const [editing, setEditing] = useState(false);
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);
  const next = useCallback(
    () => setCurrentScene((s) => Math.min(s + 1, 8)),
    [],
  );
  const restart = () => {
    setReplay((r) => r + 1);
    setCurrentScene(0);
  };
  useExperienceTool(currentScene, names[currentScene]);
  const Scene = scenes[currentScene];
  return (
    <MotionConfig reducedMotion="user">
      <div className="experience">
        <StarBackground />
        {SHOW_PREVIEW_UI && (
          <div className="preview-bar">
            <button onClick={() => setEditing(true)} className="back-button">
              <ArrowLeft size={12} /> Back to editing
            </button>
            <span className="preview-status">
              <i /> Preview <span className="preview-divider">—</span> Birthday
              surprise
            </span>
            <time>
              {time.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        )}
        <main aria-label="Birthday surprise experience">
          <AnimatePresence mode="wait">
            <SceneTransition key={`${replay}-${currentScene}`}>
              {Scene ? (
                <Scene onNext={next} />
              ) : (
                <LetterScene onReplay={restart} />
              )}
            </SceneTransition>
          </AnimatePresence>
        </main>
        {currentScene > 0 && (
          <div
            className="scene-progress"
            aria-label={`Scene ${currentScene + 1} of 9: ${names[currentScene]}`}
          >
            {names.map((name, i) => (
              <span
                key={name}
                className={
                  i === currentScene
                    ? "current"
                    : i < currentScene
                      ? "complete"
                      : ""
                }
              />
            ))}
          </div>
        )}
        <div className="experience-footer">
          <Heart size={10} />
          <span>A LITTLE BIRTHDAY MAGIC</span>
        </div>
        <MusicPlayer />
        {editing && (
          <div className="editor-overlay" onClick={() => setEditing(false)}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="editor-title"
              className="editor-note"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") setEditing(false);
                if (e.key === "Tab") {
                  const buttons = e.currentTarget.querySelectorAll("button");
                  const first = buttons[0];
                  const last = buttons[buttons.length - 1];
                  if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                  } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                  }
                }
              }}
            >
              <button
                autoFocus
                className="editor-close"
                aria-label="Close editing information"
                onClick={() => setEditing(false)}
              >
                <X size={18} />
              </button>
              <h2 id="editor-title">Make it yours ♡</h2>
              <p>
                Change the name, secret code, wishes, and letter in{" "}
                <code>src/config.ts</code>.
              </p>
              <p>
                Add your own pictures in <code>public/photos</code> and your
                song in <code>public/audio</code>.
              </p>
              <button className="pill" onClick={() => setEditing(false)}>
                Back to the magic
              </button>
            </div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
