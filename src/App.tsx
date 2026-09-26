import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Heart } from "lucide-react";
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
      </div>
    </MotionConfig>
  );
}
