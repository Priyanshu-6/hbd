# A Little Birthday Magic

A full-screen, nine-scene birthday experience built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, canvas, and Lucide icons.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Production: `npm run build`; preview that build with `npm run preview`.

## Make it personal

Edit **src/config.ts** to change the name, four-digit code (default **2004**), birth date, photos, captions, wishes, scratch-card message, and letter. The sample birth date is September 26, 2004; age statistics are calculated from it. Set `SHOW_PREVIEW_UI` to `false` to hide the preview controls. “Back to editing” opens local personalization instructions; this app does not require an external editor.

Replace these assets with your own:

- `public/photos/profile.jpg`
- `public/photos/memory-1.jpg`
- `public/photos/memory-2.jpg`
- `public/photos/puzzle.jpg`
- `public/images/scratch-reveal.jpg`
- `public/audio/birthday-song.mp3`

The included photos are an original AI-generated birthday still life used as placeholders, not personal photographs. The gift artwork is also original AI-generated art. The default soundtrack is an original synthesized, instrumental music-box composition. Add a licensed song of your choice at the configured path. Missing photos use styled fallbacks, the puzzle remains playable with numbered colored tiles, and missing audio disables its toggle without blocking the experience. Google Fonts have local font fallbacks.

## Interactions

1. Open the floating gift.
2. Enter `2004` on the keypad or keyboard; Backspace deletes a digit.
3. Continue through the personal introduction.
4. Tap to blow out the birthday candles; no microphone permission is needed.
5. Browse both Polaroid memories.
6. Pop all four wish balloons.
7. Solve the 3×3 sliding puzzle. Shuffling uses legal moves; the A* auto-solver animates a valid solution.
8. Scratch with a mouse, pen, or finger. The card reveals itself at 55% coverage. A keyboard-accessible reveal button is also available.
9. Read the typed letter, or reveal the whole text. Replay resets all scenes while the same music element continues playing.

The passcode is a playful interaction, not authentication. All personalized content is included in the client bundle.

## Verification

`npm run build` checks TypeScript and generates the production bundle. `npm test` tests legal puzzle movement and 40 randomized solver runs (requires Node 22.6+). Keyboard controls, scene sequencing, candle interaction, wishes, puzzle moves/shuffle/auto-solve, real scratch gestures, letter typing, replay, audio state, and responsive layouts are also checked in the local browser.

The interface respects reduced-motion preferences and uses semantic controls, accessible names, focused scene headings, and an internally scrollable letter.
