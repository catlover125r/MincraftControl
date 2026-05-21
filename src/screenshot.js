import { execSync } from "child_process";
import { readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const SCREENSHOT_PATH = join(tmpdir(), "mc_control_screenshot.png");

export function captureScreen() {
  execSync(`screencapture -x -t png "${SCREENSHOT_PATH}"`, { stdio: "ignore" });
  const buffer = readFileSync(SCREENSHOT_PATH);
  try {
    unlinkSync(SCREENSHOT_PATH);
  } catch {}
  return buffer.toString("base64");
}
