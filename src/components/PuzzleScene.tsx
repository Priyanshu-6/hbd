import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, WandSparkles } from "lucide-react";
import { birthdayConfig } from "../config";
import {
  SOLVED,
  isSolved,
  moveTile,
  neighbors,
  shufflePuzzle,
  solvePuzzle,
} from "../lib/puzzle";
import { Burst, Heading, NextButton, Photo } from "./Shared";
import type { SceneProps } from "./Shared";
export default function PuzzleScene({ onNext }: SceneProps) {
  const [board, setBoard] = useState(() => shufflePuzzle());
  const [moves, setMoves] = useState(0);
  const [solving, setSolving] = useState(false);
  const [image, setImage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImage(birthdayConfig.puzzleImage);
    img.src = birthdayConfig.puzzleImage;
    return () => {
      img.onload = null;
      clearTimeout(timer.current);
    };
  }, []);
  const solved = isSolved(board);
  const move = (index: number) => {
    if (solving || solved) return;
    const next = moveTile(board, index);
    if (next !== board) {
      setBoard(next);
      setMoves((m) => m + 1);
    }
  };
  const autoSolve = () => {
    setSolving(true);
    const path = solvePuzzle(board);
    let step = 0;
    const next = () => {
      if (step >= path.length) {
        setSolving(false);
        return;
      }
      setBoard(path[step++]);
      setMoves((m) => m + 1);
      timer.current = setTimeout(next, Math.max(65, 1800 / path.length));
    };
    next();
  };
  return (
    <div className="puzzle-scene">
      <div className="eyebrow">PIECE BY PIECE, A LITTLE CLOSER</div>
      <Heading subtitle="Solve to unlock a special message ✨">
        Birthday Puzzle 🎂
      </Heading>
      <div className="puzzle-meta">
        <div>
          <strong>{moves}</strong>
          <span>MOVES</span>
        </div>
        <div className="puzzle-preview">
          <span>PREVIEW</span>
          <Photo
            src={birthdayConfig.puzzleImage}
            alt="Completed puzzle preview"
          />
        </div>
      </div>
      <div
        className={`puzzle-board ${solved ? "solved" : ""}`}
        aria-label="Sliding photo puzzle"
      >
        {SOLVED.filter((tile) => tile !== 8 || solved).map((tile) => {
          const index = board.indexOf(tile);
          return (
            <motion.button
              key={tile}
              className={`puzzle-tile tile-${tile}`}
              aria-label={`Move tile ${tile + 1}`}
              disabled={
                solving ||
                solved ||
                !neighbors(board.indexOf(8)).includes(index)
              }
              onClick={() => move(index)}
              initial={false}
              animate={{
                left: `${((index % 3) * 100) / 3}%`,
                top: `${(Math.floor(index / 3) * 100) / 3}%`,
              }}
              transition={{ duration: solving ? 0.07 : 0.2, ease: "easeInOut" }}
              style={{
                backgroundImage: image ? `url("${image}")` : undefined,
                backgroundPosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%`,
              }}
            >
              <span>{tile + 1}</span>
            </motion.button>
          );
        })}
        <Burst show={solved} />
      </div>
      <p className="puzzle-hint" role="status">
        {solved
          ? "You did it! 🎉"
          : solving
            ? "Solving it for you..."
            : "Tap a tile next to the empty space."}
      </p>
      <div className="puzzle-actions">
        <button
          className="pill"
          disabled={solving}
          onClick={() => {
            setBoard(shufflePuzzle());
            setMoves(0);
          }}
        >
          <RotateCcw size={13} /> Shuffle Again
        </button>
        <button
          className="pill pink-border"
          disabled={solving || solved}
          onClick={autoSolve}
        >
          <WandSparkles size={13} /> Solve it for me
        </button>
      </div>
      {solved && (
        <div className="puzzle-next">
          <NextButton onClick={onNext}>A little more magic</NextButton>
        </div>
      )}
    </div>
  );
}
