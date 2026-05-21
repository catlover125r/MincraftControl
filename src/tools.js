// Tool definitions for Claude — each maps to an in-game action

export const tools = [
  {
    name: "move_forward",
    description: "Walk forward (hold W key) for a duration",
    input_schema: {
      type: "object",
      properties: {
        duration_ms: { type: "number", description: "How long to hold W, in milliseconds (e.g. 1000 = 1 second)" },
      },
      required: ["duration_ms"],
    },
  },
  {
    name: "move_backward",
    description: "Walk backward (hold S key) for a duration",
    input_schema: {
      type: "object",
      properties: {
        duration_ms: { type: "number", description: "Milliseconds to hold S" },
      },
      required: ["duration_ms"],
    },
  },
  {
    name: "strafe_left",
    description: "Move sideways left (hold A key) for a duration",
    input_schema: {
      type: "object",
      properties: {
        duration_ms: { type: "number", description: "Milliseconds to hold A" },
      },
      required: ["duration_ms"],
    },
  },
  {
    name: "strafe_right",
    description: "Move sideways right (hold D key) for a duration",
    input_schema: {
      type: "object",
      properties: {
        duration_ms: { type: "number", description: "Milliseconds to hold D" },
      },
      required: ["duration_ms"],
    },
  },
  {
    name: "look",
    description: "Move the camera/mouse to look in a direction. Use to aim at blocks or entities before mining/interacting.",
    input_schema: {
      type: "object",
      properties: {
        delta_x: { type: "number", description: "Pixels to move mouse horizontally. Positive = look right, negative = look left." },
        delta_y: { type: "number", description: "Pixels to move mouse vertically. Positive = look down, negative = look up." },
      },
      required: ["delta_x", "delta_y"],
    },
  },
  {
    name: "jump",
    description: "Press the jump key (spacebar) once",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "navigate_forward",
    description: "Walk forward while automatically jumping every ~600ms to get over obstacles, uneven ground, and blocks. Use this for all terrain traversal.",
    input_schema: {
      type: "object",
      properties: {
        duration_ms: { type: "number", description: "Milliseconds to walk. 1000ms ≈ 4 blocks, 3000ms ≈ 12 blocks." },
      },
      required: ["duration_ms"],
    },
  },
  {
    name: "sprint",
    description: "Sprint forward (double-tap W then hold) for a duration",
    input_schema: {
      type: "object",
      properties: {
        duration_ms: { type: "number", description: "Milliseconds to sprint" },
      },
      required: ["duration_ms"],
    },
  },
  {
    name: "mine",
    description: "Hold left click to mine/attack whatever is in the crosshair. Use look first to aim.",
    input_schema: {
      type: "object",
      properties: {
        duration_ms: { type: "number", description: "Milliseconds to hold left click. Stone takes ~1500ms, wood ~1000ms, dirt ~500ms with bare hands." },
      },
      required: ["duration_ms"],
    },
  },
  {
    name: "place_block",
    description: "Right-click to place a block or interact with whatever is in the crosshair",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "interact",
    description: "Right-click to interact with a block (open chest, use furnace, talk to villager, etc.)",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "select_slot",
    description: "Select a hotbar slot (1-9)",
    input_schema: {
      type: "object",
      properties: {
        slot: { type: "number", description: "Hotbar slot number, 1 through 9" },
      },
      required: ["slot"],
    },
  },
  {
    name: "open_inventory",
    description: "Open the inventory screen (press E)",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "close_menu",
    description: "Close an open inventory, chest, crafting table, or furnace menu (press Escape). WARNING: only call this when you can see an inventory or container menu on screen. If you press Escape during normal gameplay it will open the PAUSE menu and break everything.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "screenshot",
    description: "Take a fresh screenshot to see the current state of the game. Use this after a series of actions to check progress.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "task_complete",
    description: "Signal that the task has been fully completed. Call this when the goal is achieved.",
    input_schema: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Brief description of what was accomplished" },
      },
      required: ["summary"],
    },
  },
];
