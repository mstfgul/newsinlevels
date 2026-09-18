#!/usr/bin/env python3
"""Trim idle time from a simulator screen recording.

Tool-call latency leaves long static holds between gestures; this keeps each
static stretch to at most HOLD seconds (so the eye still gets a beat on every
screen), then re-encodes for the web: H.264, 1280px tall, 30 fps, silent.
usage: condense.py in.mov out.mp4 [hold_seconds] [tail_hold]
"""
import re, subprocess, sys
src, dst = sys.argv[1], sys.argv[2]
hold = float(sys.argv[3]) if len(sys.argv) > 3 else 1.5
tail_hold = float(sys.argv[4]) if len(sys.argv) > 4 else 2.0
probe = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",src],capture_output=True,text=True)
total = float(probe.stdout.strip())
det = subprocess.run(["ffmpeg","-hide_banner","-i",src,"-vf","fps=30,freezedetect=n=0.003:d=0.8","-an","-f","null","-"],capture_output=True,text=True).stderr
starts = [float(x) for x in re.findall(r"freeze_start: ([0-9.]+)", det)]
ends = [float(x) for x in re.findall(r"freeze_end: ([0-9.]+)", det)]
freezes = list(zip(starts, ends))
if len(starts) > len(ends):  # freeze runs to the end of the file
    freezes.append((starts[-1], total))
keep, cursor = [], 0.0
for s, e in freezes:
    is_last = e >= total - 0.05
    h = tail_hold if is_last else hold
    if e - s > h:
        keep.append((cursor, s + h)); cursor = e
if cursor < total:
    keep.append((cursor, total))
kept = sum(b - a for a, b in keep)
expr = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in keep)
vf = f"fps=30,select='{expr}',setpts=N/FRAME_RATE/TB,scale=-2:1920:flags=lanczos"
subprocess.run(["ffmpeg","-y","-hide_banner","-loglevel","error","-i",src,"-vf",vf,"-an","-c:v","libx264","-crf","26","-preset","slow","-pix_fmt","yuv420p","-movflags","+faststart",dst],check=True)
print(f"{src}: {total:.1f}s, {len(freezes)} static stretches → kept {kept:.1f}s → {dst}")
