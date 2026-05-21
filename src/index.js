import "dotenv/config";
import readline from "readline";
import { runAgent } from "./agent.js";
import * as actions from "./actions.js";

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY not set. Copy .env.example to .env and add your key.");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Minecraft AI Controller");
console.log("=======================");
console.log("Type @@ to run the control test. Type a task to use the AI agent.\n");

async function runTest() {
  console.log("[Test] Starting in 3 seconds — switch to Minecraft now...");
  await new Promise(r => setTimeout(r, 3000));
  console.log("[Test] Starting control test — watch your game...");

  console.log("[Test] Walking forward 6 blocks...");
  await actions.moveForward(3000);

  console.log("[Test] Looking right...");
  await actions.look(300, 0);

  console.log("[Test] Looking left...");
  await actions.look(-600, 0);

  console.log("[Test] Looking back to center...");
  await actions.look(300, 0);

  console.log("[Test] Switching hotbar slots 1 → 2 → 3 → 1...");
  await actions.selectSlot(1);
  await new Promise(r => setTimeout(r, 400));
  await actions.selectSlot(2);
  await new Promise(r => setTimeout(r, 400));
  await actions.selectSlot(3);
  await new Promise(r => setTimeout(r, 400));
  await actions.selectSlot(1);

  console.log("[Test] Done. Did anything happen in game?");
}

function prompt() {
  rl.question("Command> ", async (input) => {
    const command = input.trim();
    if (!command) return prompt();

    if (command === "exit" || command === "quit") {
      console.log("Goodbye.");
      rl.close();
      return;
    }

    try {
      if (command === "@@") {
        await runTest();
      } else {
        await runAgent(command);
      }
    } catch (err) {
      console.error("[Error]", err.message);
    }

    prompt();
  });
}

prompt();
