#!/usr/bin/env python
"""
Process the high-clarity native hero image into 2K/QHD WebP assets:
Desktop: 2560x1440 (2K QHD 16:9)
Mobile:  1080x1920 (FHD Portrait)
"""
import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

gen_path = r'C:\Users\Dell\.gemini\antigravity-ide\brain\a5aad4de-0c55-4402-ac0c-a95b1f9999eb\hero_agency_team_1789139276492.jpg'
assets_dir = r'C:\Users\Dell\Downloads\Snapnow\assets'

# --- 1. Desktop 2K (2560x1440) ---
img = Image.open(gen_path).convert('RGB')
print(f"Source image size: {img.size}")

# High quality Lanczos resize to 2K (2560x1440)
desktop = img.resize((2560, 1440), Image.Resampling.LANCZOS)

# Subtle, natural sharpening for 2K display (no harsh ringing)
desktop = desktop.filter(ImageFilter.UnsharpMask(radius=1.2, percent=130, threshold=2))
desktop = ImageEnhance.Sharpness(desktop).enhance(1.15)
desktop = ImageEnhance.Contrast(desktop).enhance(1.05)

desktop_out = os.path.join(assets_dir, 'hero_banner.webp')
desktop.save(desktop_out, 'WEBP', quality=95, method=6)
print(f"Desktop 2K saved: 2560x1440 @ {os.path.getsize(desktop_out)//1024}KB")

# --- 2. Mobile (1080x1920 Portrait) ---
# Load with cv2 for pixel-perfect composition
src_cv = cv2.imread(gen_path)
h, w = src_cv.shape[:2]

# Crop the team portion (focused on the people and studio action)
# Width is 1376. People are from approx x=480 to x=1376
team_crop = src_cv[:, int(w * 0.35):w]
ch, cw = team_crop.shape[:2]

# Scale to width 1080
scale = 1080 / cw
new_w = 1080
new_h = int(ch * scale)
team_scaled = cv2.resize(team_crop, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)

# Create 1080x1920 canvas with dark gradient top for mobile floating text
canvas = np.zeros((1920, 1080, 3), dtype=np.uint8)

# Position team in lower portion so hero title has ample dark breathing room above
y_start = 1920 - new_h
if y_start < 0:
    team_scaled = team_scaled[-y_start:, :]
    y_start = 0

canvas[y_start:y_start+team_scaled.shape[0], :] = team_scaled

# Smooth blend transition at the top of the team crop
blend_h = 120
if y_start > 0:
    for i in range(blend_h):
        alpha = i / blend_h
        row = y_start + i
        if row < 1920:
            canvas[row, :] = (canvas[row, :].astype(float) * alpha).astype(np.uint8)

# Convert to PIL for final polish
mobile_pil = Image.fromarray(cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB))
mobile_pil = mobile_pil.filter(ImageFilter.UnsharpMask(radius=1.0, percent=120, threshold=2))
mobile_pil = ImageEnhance.Sharpness(mobile_pil).enhance(1.15)
mobile_pil = ImageEnhance.Contrast(mobile_pil).enhance(1.05)

mobile_out = os.path.join(assets_dir, 'hero_banner_mobile.webp')
mobile_pil.save(mobile_out, 'WEBP', quality=95, method=6)
print(f"Mobile portrait saved: 1080x1920 @ {os.path.getsize(mobile_out)//1024}KB")

print("All hero assets built successfully!")
