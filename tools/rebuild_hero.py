#!/usr/bin/env python
"""
Rebuild hero banner from the user-attached high-quality photo.
Strategy:
1. Load original source photo (1024x576) with authentic studio lighting and skin tones
2. Desktop (2048x1152): Upscale cleanly using Lanczos4 interpolation with pristine quality 95 WebP
3. Mobile (1080x1920): Place team on balanced lower portion with natural dark top space for readable hero typography
"""
import cv2, numpy as np, os

src_path = r'C:\Users\Dell\.gemini\antigravity-ide\brain\a5aad4de-0c55-4402-ac0c-a95b1f9999eb\.user_uploaded\media_1789128123057.jpg'

src = cv2.imread(src_path)
if src is None:
    raise FileNotFoundError(f"Source image not found at {src_path}")
h, w = src.shape[:2]
print(f"[1] Source loaded: {w}x{h}")

# ── 1. Desktop: High-clarity 2K (2048x1152) ──
desktop = cv2.resize(src, (2048, 1152), interpolation=cv2.INTER_LANCZOS4)
desktop_path = 'assets/hero_banner.webp'
cv2.imwrite(desktop_path, desktop, [cv2.IMWRITE_WEBP_QUALITY, 95])
size_kb = os.path.getsize(desktop_path) / 1024
print(f"[2] Desktop saved: {desktop.shape[1]}x{desktop.shape[0]} @ {size_kb:.1f}KB")

# ── 2. Mobile: 1080x1920 Portrait ──
# Seamless dark top for floating typography, full team framed clearly in lower half
team_crop = src[:, 360:1024]
th, tw = team_crop.shape[:2]
scale = 1080 / tw
new_tw = 1080
new_th = int(th * scale)
team_scaled = cv2.resize(team_crop, (new_tw, new_th), interpolation=cv2.INTER_LANCZOS4)

canvas = np.zeros((1920, 1080, 3), dtype=np.uint8)
y_offset = 1920 - new_th - 40
canvas[y_offset:y_offset+new_th, 0:new_tw] = team_scaled

mobile_path = 'assets/hero_banner_mobile.webp'
cv2.imwrite(mobile_path, canvas, [cv2.IMWRITE_WEBP_QUALITY, 95])
mobile_size_kb = os.path.getsize(mobile_path) / 1024
print(f"[3] Mobile saved: {canvas.shape[1]}x{canvas.shape[0]} @ {mobile_size_kb:.1f}KB")
print("Done!")
