import { keyboard, mouse, Key, Button } from "@nut-tree-fork/nut-js";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MOUSE_SCRIPT = join(__dirname, "mouse_delta.py");

// Lower delay = faster but less reliable. 50ms is a good balance.
keyboard.config.autoDelayMs = 50;
mouse.config.autoDelayMs = 50;
mouse.config.mouseSpeed = 1500;

// Focus Minecraft before sending any input
async function focusMinecraft() {
  execSync(
    `osascript -e 'tell application "System Events" to tell process "java" to set frontmost to true'`,
    { stdio: "ignore" }
  );
  await sleep(300);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function moveForward(durationMs) {
  await focusMinecraft();
  await keyboard.pressKey(Key.W);
  await sleep(durationMs);
  await keyboard.releaseKey(Key.W);
}

export async function moveBackward(durationMs) {
  await focusMinecraft();
  await keyboard.pressKey(Key.S);
  await sleep(durationMs);
  await keyboard.releaseKey(Key.S);
}

export async function strafeLeft(durationMs) {
  await focusMinecraft();
  await keyboard.pressKey(Key.A);
  await sleep(durationMs);
  await keyboard.releaseKey(Key.A);
}

export async function strafeRight(durationMs) {
  await focusMinecraft();
  await keyboard.pressKey(Key.D);
  await sleep(durationMs);
  await keyboard.releaseKey(Key.D);
}

// deltaX/Y — positive X = look right, positive Y = look down
// Single Python call handles all steps internally to avoid process-spawn overhead
export async function look(deltaX, deltaY) {
  await focusMinecraft();
  const steps = 10;
  const delayMs = 8;
  execSync(
    `python3 "${MOUSE_SCRIPT}" ${Math.round(deltaX)} ${Math.round(deltaY)} ${steps} ${delayMs}`,
    { stdio: "ignore" }
  );
}

export async function jump() {
  await focusMinecraft();
  await keyboard.pressKey(Key.Space);
  await sleep(100);
  await keyboard.releaseKey(Key.Space);
}

export async function mine(durationMs) {
  await focusMinecraft();
  await mouse.pressButton(Button.LEFT);
  await sleep(durationMs);
  await mouse.releaseButton(Button.LEFT);
}

export async function placeBlock() {
  await focusMinecraft();
  await mouse.click(Button.RIGHT);
}

export async function selectSlot(slot) {
  await focusMinecraft();
  const keyMap = {
    1: Key.Num1, 2: Key.Num2, 3: Key.Num3,
    4: Key.Num4, 5: Key.Num5, 6: Key.Num6,
    7: Key.Num7, 8: Key.Num8, 9: Key.Num9,
  };
  const key = keyMap[slot];
  if (!key) return;
  await keyboard.pressKey(key);
  await sleep(50);
  await keyboard.releaseKey(key);
}

export async function openInventory() {
  await focusMinecraft();
  await keyboard.pressKey(Key.E);
  await sleep(100);
  await keyboard.releaseKey(Key.E);
}

export async function closeMenu() {
  await focusMinecraft();
  await keyboard.pressKey(Key.Escape);
  await sleep(100);
  await keyboard.releaseKey(Key.Escape);
}

// Walk forward while periodically jumping to get over obstacles
export async function navigateForward(durationMs) {
  await focusMinecraft();
  const jumpInterval = 600;
  const end = Date.now() + durationMs;
  await keyboard.pressKey(Key.W);
  while (Date.now() < end) {
    await keyboard.pressKey(Key.Space);
    await sleep(100);
    await keyboard.releaseKey(Key.Space);
    await sleep(Math.min(jumpInterval - 100, end - Date.now()));
  }
  await keyboard.releaseKey(Key.W);
}

export async function sprint(durationMs) {
  await focusMinecraft();
  // Double-tap W to sprint
  await keyboard.pressKey(Key.W);
  await sleep(50);
  await keyboard.releaseKey(Key.W);
  await sleep(50);
  await keyboard.pressKey(Key.W);
  await sleep(durationMs);
  await keyboard.releaseKey(Key.W);
}

export async function dropItem() {
  await focusMinecraft();
  await keyboard.pressKey(Key.Q);
  await sleep(100);
  await keyboard.releaseKey(Key.Q);
}

export async function interact() {
  await focusMinecraft();
  await mouse.click(Button.RIGHT);
}
