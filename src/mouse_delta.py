#!/usr/bin/env python3
"""Post raw mouse delta events. Args: dx dy [steps] [delay_ms]"""
import sys
import time
import Quartz

dx    = int(float(sys.argv[1]))
dy    = int(float(sys.argv[2]))
steps = int(sys.argv[3]) if len(sys.argv) > 3 else 1
delay = float(sys.argv[4]) / 1000.0 if len(sys.argv) > 4 else 0.0

step_x = dx // steps
step_y = dy // steps
pos = Quartz.CGEventGetLocation(Quartz.CGEventCreate(None))

for i in range(steps):
    event = Quartz.CGEventCreateMouseEvent(None, Quartz.kCGEventMouseMoved, pos, 0)
    Quartz.CGEventSetIntegerValueField(event, Quartz.kCGMouseEventDeltaX, step_x)
    Quartz.CGEventSetIntegerValueField(event, Quartz.kCGMouseEventDeltaY, step_y)
    Quartz.CGEventPost(Quartz.kCGHIDEventTap, event)
    if delay > 0 and i < steps - 1:
        time.sleep(delay)
