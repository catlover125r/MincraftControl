import Anthropic from "@anthropic-ai/sdk";
import { captureScreen } from "./screenshot.js";
import { tools } from "./tools.js";
import * as actions from "./actions.js";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an AI agent controlling a Minecraft game through keyboard and mouse inputs.
You can see the game screen and perform actions by calling tools.

Guidelines:
- The game is already running in normal gameplay when you start. Do NOT press Escape or call close_menu at the beginning — you are already in the game world, no menus are open
- Take a screenshot first to see what's on screen, then plan and execute a long sequence of actions before checking again
- Batch as many actions as possible per turn — only screenshot when you genuinely need to check progress (after navigating somewhere, after mining, after a big direction change)
- NEVER call close_menu unless you can clearly see an inventory, chest, crafting table, or container screen open. Pressing Escape during normal gameplay opens the pause menu
- When navigating terrain, always use navigate_forward — it auto-jumps over obstacles so you don't get stuck
- Use move_forward only for short precise nudges under 500ms
- When mining a block, use look() to aim the crosshair at it first
- CAMERA AIM: The screenshot is 1280px wide and shows 70° horizontal FOV. Screen center = forward direction.
  To aim at something visible on screen: delta_x = (target_x - 640) / 640 * 350
  Examples: target at x=960 (320px right of center) → delta_x=+175. Target at x=320 (320px left) → delta_x=-175.
  For vertical: delta_y = (target_y - 360) / 360 * 200. Use this formula to hit targets in ONE look call.
- Mining times: dirt/sand ~400ms, wood ~750ms, stone ~1500ms, iron ore ~2000ms
- To find trees: look around 360° in steps of ~300 delta_x, take a screenshot, identify tree position in pixels, compute delta and aim in one shot
- Always call task_complete when done
- If stuck while navigating, look() in a different direction then try navigate_forward again`;

export async function runAgent(userCommand) {
  console.log(`\n[Agent] Starting task: "${userCommand}"`);

  const screenshotBase64 = captureScreen();

  const messages = [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/png",
            data: screenshotBase64,
          },
        },
        {
          type: "text",
          text: `Current game screenshot above. Task: ${userCommand}`,
        },
      ],
    },
  ];

  let done = false;

  while (!done) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    // Add assistant response to history
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      // No tool call — Claude gave up or finished without calling task_complete
      const text = response.content.find((b) => b.type === "text");
      console.log(`[Agent] Done: ${text?.text ?? "(no message)"}`);
      done = true;
      break;
    }

    // Process tool calls
    const toolResults = [];

    for (const block of response.content) {
      if (block.type !== "tool_use") continue;

      const { name, input, id } = block;
      console.log(`[Agent] Action: ${name}`, Object.keys(input).length ? input : "");

      let result = "ok";

      try {
        switch (name) {
          case "move_forward":
            await actions.moveForward(input.duration_ms);
            break;
          case "move_backward":
            await actions.moveBackward(input.duration_ms);
            break;
          case "strafe_left":
            await actions.strafeLeft(input.duration_ms);
            break;
          case "strafe_right":
            await actions.strafeRight(input.duration_ms);
            break;
          case "look":
            await actions.look(input.delta_x, input.delta_y);
            break;
          case "jump":
            await actions.jump();
            break;
          case "navigate_forward":
            await actions.navigateForward(input.duration_ms);
            break;
          case "sprint":
            await actions.sprint(input.duration_ms);
            break;
          case "mine":
            await actions.mine(input.duration_ms);
            break;
          case "place_block":
            await actions.placeBlock();
            break;
          case "interact":
            await actions.interact();
            break;
          case "select_slot":
            await actions.selectSlot(input.slot);
            break;
          case "open_inventory":
            await actions.openInventory();
            break;
          case "close_menu":
            await actions.closeMenu();
            break;
          case "screenshot": {
            const newScreenshot = captureScreen();
            result = {
              type: "image",
              source: { type: "base64", media_type: "image/png", data: newScreenshot },
            };
            break;
          }
          case "task_complete":
            console.log(`\n[Agent] Task complete: ${input.summary}`);
            done = true;
            break;
        }
      } catch (err) {
        result = `Error: ${err.message}`;
        console.error(`[Agent] Error executing ${name}:`, err.message);
      }

      if (typeof result === "string") {
        toolResults.push({ type: "tool_result", tool_use_id: id, content: result });
      } else {
        // Image result (from screenshot tool)
        toolResults.push({ type: "tool_result", tool_use_id: id, content: [result] });
      }
    }

    if (!done && toolResults.length > 0) {
      messages.push({ role: "user", content: toolResults });
    }
  }
}
