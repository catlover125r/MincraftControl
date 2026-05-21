import { execSync } from "child_process";
import { readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const SCREENSHOT_PATH = join(tmpdir(), "mc_control_screenshot.png");
const RESIZED_PATH = join(tmpdir(), "mc_control_screenshot_small.png");

export function captureScreen() {
  execSync(`screencapture -x -t png "${SCREENSHOT_PATH}"`, { stdio: "ignore" });
  // Resize to max 1280px wide to stay under Claude's 5MB image limit
  execSync(`sips -Z 1280 "${SCREENSHOT_PATH}" --out "${RESIZED_PATH}"`, { stdio: "ignore" });
  const buffer = readFileSync(RESIZED_PATH);
  try {
    unlinkSync(SCREENSHOT_PATH);
    unlinkSync(RESIZED_PATH);
  } catch {}
  return buffer.toString("base64");
}
