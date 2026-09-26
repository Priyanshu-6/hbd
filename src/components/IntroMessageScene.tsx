import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { birthdayConfig } from "../config";
import { Heading, NextButton, Photo } from "./Shared";
import type { SceneProps } from "./Shared";
export default function IntroMessageScene({ onNext }: SceneProps) {
  return (
    <div className="intro-scene">
      <motion.div
        className="avatar-ring"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Photo src={birthdayConfig.profile} alt="A special birthday memory" />
      </motion.div>
      <div className="eyebrow">HEY, MY FAVOURITE HUMAN</div>
      <Heading subtitle={birthdayConfig.introMessage}>
        {birthdayConfig.introHeading}
      </Heading>
      <motion.div
        className="scene-action"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <NextButton onClick={onNext}>
          Continue <ArrowDown size={13} />
        </NextButton>
      </motion.div>
    </div>
  );
}
