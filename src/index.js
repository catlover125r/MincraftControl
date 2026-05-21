import "dotenv/config";
import readline from "readline";
import { runAgent } from "./agent.js";

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
console.log("Make sure Minecraft is open and you're in-game.");
console.log("Type a command and press Enter. The bot will take control of your game.\n");

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
      await runAgent(command);
    } catch (err) {
      console.error("[Error]", err.message);
    }

    prompt();
  });
}

prompt();
