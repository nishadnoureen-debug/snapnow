#!/usr/bin/env python
"""
Rebuild hero banner with maximum sharpness.
Strategy:
1. Load original JPG source (1024x576, sharpness=218)
2. Apply heavy sharpening at native resolution FIRST (before any scaling)
3. Upscale 2x using INTER_LANCZOS4 (best quality interpolation)
4. Apply second round of sharpening after upscale to recover edge detail
5. Export desktop (2048x1152) and mobile crop (1080x1920) at WebP quality 92
"""
import cv2, numpy as np, os, shutil

src_path = r'C:\Users\Dell\.gemini\antigravity-ide\brain\50b9bad8-6201-42c4-8b8b-dca23b9db9bb\.user_uploaded\media_1789045284486.jpg'

def measure_sharpness(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return round(cv2.Laplacian(gray, cv2.CV_64F).var())

def sharpen(img, strength=1.8):
    """Unsharp mask sharpening — preserves natural look while boosting edges."""
    blurred = cv2.GaussianBlur(img, (0, 0), 2.0)
    sharpened = cv2.addWeighted(img, 1.0 + strength, blurred, -strength, 0)
    return np.clip(sharpened, 0, 255).astype(np.uint8)

def sharpen_fine(img, strength=1.2):
    """Fine-detail sharpening with tighter radius for post-upscale touch-up."""
    blurred = cv2.GaussianBlur(img, (0, 0), 0.8)
    sharpened = cv2.addWeighted(img, 1.0 + strength, blurred, -strength, 0)
    return np.clip(sharpened, 0, 255).astype(np.uint8)

def clahe_enhance(img):
    """Enhance local contrast (CLAHE) to recover shadow/highlight detail."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    return cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2BGR)

# Load source
src = cv2.imread(src_path)
h, w = src.shape[:2]
print(f"[1] Source loaded: {w}x{h}, sharpness={measure_sharpness(src)}")

# Step 1: CLAHE contrast enhancement at native resolution
enhanced = clahe_enhance(src)
print(f"[2] After CLAHE: sharpness={measure_sharpness(enhanced)}")

# Step 2: Heavy sharpen at native resolution FIRST
sharpened_native = sharpen(enhanced, strength=2.2)
print(f"[3] After native sharpen: sharpness={measure_sharpness(sharpened_native)}")

# Step 3: Upscale to 2x = 2048x1152 with Lanczos4 (best quality interpolation)
upscaled = cv2.resize(sharpened_native, (2048, 1152), interpolation=cv2.INTER_LANCZOS4)
print(f"[4] After Lanczos4 upscale to 2048x1152: sharpness={measure_sharpness(upscaled)}")

# Step 4: Post-upscale fine sharpening to recover edge micro-detail
desktop = sharpen_fine(upscaled, strength=0.9)
print(f"[5] After post-upscale sharpen: sharpness={measure_sharpness(desktop)}")

# Save desktop banner
desktop_path = 'assets/hero_banner.webp'
cv2.imwrite(desktop_path, desktop, [cv2.IMWRITE_WEBP_QUALITY, 92])
size_kb = os.path.getsize(desktop_path) / 1024
print(f"[6] Desktop saved: {round(size_kb,1)}KB, final sharpness={measure_sharpness(desktop)}")

# ── Mobile version: portrait crop 1080x1920 ──
# Use native sharpened source for mobile crop (no 2x upscale, different aspect)
# Scale to height=1920, width = 1920 * (16/9) => 1024/576 ratio preserved
mobile_h = 1920
mobile_w = int(w * mobile_h / h)  # ~3413 wide → crop center to 1080
mobile_big = cv2.resize(sharpened_native, (mobile_w, mobile_h), interpolation=cv2.INTER_LANCZOS4)

# Center crop to 1080 wide (focus on right side where the team is)
x_start = max(0, (mobile_w - 1080) // 2 + 200)  # shift right to show team
x_end = x_start + 1080
if x_end > mobile_w:
    x_end = mobile_w
    x_start = x_end - 1080
mobile_crop = mobile_big[:, x_start:x_end]

# Post-sharpen the mobile crop
mobile_final = sharpen_fine(mobile_crop, strength=0.9)
print(f"[7] Mobile crop: {mobile_final.shape[1]}x{mobile_final.shape[0]}, sharpness={measure_sharpness(mobile_final)}")

mobile_path = 'assets/hero_banner_mobile.webp'
cv2.imwrite(mobile_path, mobile_final, [cv2.IMWRITE_WEBP_QUALITY, 92])
mobile_size_kb = os.path.getsize(mobile_path) / 1024
print(f"[8] Mobile saved: {round(mobile_size_kb,1)}KB, final sharpness={measure_sharpness(mobile_final)}")

print("Done!")
