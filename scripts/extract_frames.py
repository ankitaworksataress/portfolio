#!/usr/bin/env python3
"""Extract 64 directional WebP frames + center.webp from character.mp4."""

from __future__ import annotations

import json
from pathlib import Path

import cv2
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
VIDEO = ROOT / "public" / "character.mp4"
OUT = ROOT / "public" / "frames"
META = OUT / "meta.json"

# Compass labels for documentation / debugging (video path starts at center)
DIRECTIONS = {
    "CENTER": 0,
    "UP": 1 / 8,
    "UP_RIGHT": 2 / 8,
    "RIGHT": 3 / 8,
    "DOWN_RIGHT": 4 / 8,
    "DOWN": 5 / 8,
    "DOWN_LEFT": 6 / 8,
    "LEFT": 7 / 8,
    "UP_LEFT": 0 / 8,  # near end of loop ≈ center approach; remapped below
}


def bgr_to_hex(bgr) -> str:
    b, g, r = [int(x) for x in bgr]
    return f"#{r:02X}{g:02X}{b:02X}"


def main() -> None:
    if not VIDEO.exists():
        raise SystemExit(f"Missing video: {VIDEO}")

    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.webp"):
        old.unlink()

    cap = cv2.VideoCapture(str(VIDEO))
    if not cap.isOpened():
        raise SystemExit("Could not open character.mp4")

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = float(cap.get(cv2.CAP_PROP_FPS) or 24)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    if total < 8:
        raise SystemExit(f"Video too short: {total} frames")

    # Sample corner pixels from first frame for seamless page background
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    ok, first = cap.read()
    if not ok:
        raise SystemExit("Failed to read first frame")
    bg_hex = bgr_to_hex(first[20, 20])

    # Identify compass keyframes along the 360° trajectory
    # UP_LEFT sits just before returning to center (7/8 of the ring, not 0)
    direction_frames = {
        "CENTER": 0,
        "UP": int(round((1 / 8) * (total - 1))),
        "UP_RIGHT": int(round((2 / 8) * (total - 1))),
        "RIGHT": int(round((3 / 8) * (total - 1))),
        "DOWN_RIGHT": int(round((4 / 8) * (total - 1))),
        "DOWN": int(round((5 / 8) * (total - 1))),
        "DOWN_LEFT": int(round((6 / 8) * (total - 1))),
        "LEFT": int(round((7 / 8) * (total - 1))),
        "UP_LEFT": int(round((7.5 / 8) * (total - 1))) % total,
    }

    # 64 frames ~5.625° apart around the ring (skip last duplicate of first)
    ring_indices = [
        int(round(i * (total - 1) / 64)) % total for i in range(64)
    ]

    def read_frame(idx: int):
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        success, frame = cap.read()
        if not success:
            raise RuntimeError(f"Failed reading frame {idx}")
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return Image.fromarray(rgb)

    # center.webp — neutral eye contact
    read_frame(direction_frames["CENTER"]).save(
        OUT / "center.webp", "WEBP", quality=92, method=6
    )

    for i, idx in enumerate(ring_indices):
        read_frame(idx).save(
            OUT / f"frame_{i:03d}.webp", "WEBP", quality=92, method=6
        )

    cap.release()

    meta = {
        "totalVideoFrames": total,
        "fps": fps,
        "width": width,
        "height": height,
        "background": bg_hex,
        "ringCount": 64,
        "degreesPerFrame": 360 / 64,
        "directionFrames": direction_frames,
        "ringIndices": ring_indices,
    }
    META.write_text(json.dumps(meta, indent=2))
    print(json.dumps(meta, indent=2))
    print(f"Wrote {64} ring frames + center.webp → {OUT}")


if __name__ == "__main__":
    main()
