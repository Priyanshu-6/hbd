/** Detect a gentle sustained sound above the room's initial noise floor. */
export function createBlowDetector(startedAt: number) {
  let baseline = 0;
  let samples = 0;
  let aboveSince: number | null = null;
  return (rms: number, now: number) => {
    if (now - startedAt < 650) {
      baseline += rms;
      samples++;
      return { ready: false, triggered: false, level: 0 };
    }
    const threshold = Math.max(0.018, (baseline / Math.max(1, samples)) * 2.4);
    if (rms >= threshold) aboveSince ??= now;
    else aboveSince = null;
    return {
      ready: true,
      triggered: aboveSince !== null && now - aboveSince >= 100,
      level: Math.min(1, rms / threshold),
    };
  };
}
