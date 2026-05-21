# Minecraft AI Controller

Controls your Minecraft game using AI vision — type a command, Claude looks at your screen and uses your keyboard/mouse to do it.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your Anthropic API key**
   ```bash
   cp .env.example .env
   # Edit .env and set ANTHROPIC_API_KEY=your_key_here
   ```

3. **Grant accessibility permissions** (macOS)
   - System Settings → Privacy & Security → Accessibility
   - Add your terminal app (Terminal, iTerm2, etc.)
   - This is required for keyboard/mouse control

4. **Open Minecraft** and load into a world

5. **Run the controller**
   ```bash
   npm start
   ```

6. **Type commands** — switch to Minecraft, then type in the terminal:
   ```
   Command> mine some wood
   Command> find and eat food
   Command> build a small shelter
   ```

## How it works

1. Takes a screenshot of your screen
2. Sends it to Claude with your command
3. Claude decides what keys/mouse movements to use
4. Executes those inputs on your computer
5. Repeats (screenshot → think → act) until done

## Tips

- Keep Minecraft in the foreground while the bot runs
- Mouse sensitivity in Minecraft affects how `look` actions behave — default sensitivity works best
- For complex tasks, be specific: "mine 5 oak logs" is better than "get wood"
- Type `exit` to quit
