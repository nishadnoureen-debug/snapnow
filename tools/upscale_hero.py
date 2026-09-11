#!/usr/bin/env python
"""
Resize and sharpen hero banner images to 2K/QHD resolution.
Desktop: -> 2560x1440 (2K QHD)
Mobile:  -> 1080x1920 (FHD portrait)
"""
import os
from PIL import Image, ImageEnhance, ImageFilter

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
assets = os.path.join(root, 'assets')

def upscale_and_sharpen(src_path, out_path, new_size, sharpness=1.35, unsharp_radius=1.8, unsharp_percent=140, unsharp_threshold=3, quality=92):
    img = Image.open(src_path).convert('RGB')
    orig_size = img.size
    print(f"  Original: {orig_size[0]}x{orig_size[1]} @ {os.path.getsize(src_path)//1024}KB")

    # Step 1: Upscale with Lanczos (best quality downsampling kernel)
    img = img.resize(new_size, Image.Resampling.LANCZOS)

    # Step 2: Unsharp Mask for edge clarity (radius, percent, threshold)
    img = img.filter(ImageFilter.UnsharpMask(radius=unsharp_radius, percent=unsharp_percent, threshold=unsharp_threshold))

    # Step 3: Slight sharpness boost using ImageEnhance
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(sharpness)

    # Step 4: Slight contrast boost for vibrancy
    contrast_enhancer = ImageEnhance.Contrast(img)
    img = contrast_enhancer.enhance(1.08)

    # Step 5: Save as high-quality WebP
    img.save(out_path, 'WEBP', quality=quality, method=6)
    new_size_kb = os.path.getsize(out_path) // 1024
    print(f"  Output:   {new_size[0]}x{new_size[1]} @ {new_size_kb}KB  -> {out_path}")

print("Resizing desktop hero_banner.webp -> 2560x1440 (2K QHD)...")
upscale_and_sharpen(
    src_path=os.path.join(assets, 'hero_banner.webp'),
    out_path=os.path.join(assets, 'hero_banner.webp'),
    new_size=(2560, 1440),
    sharpness=1.25,
    unsharp_radius=1.2,
    unsharp_percent=120,
    unsharp_threshold=2,
    quality=92
)

print("\nResizing mobile hero_banner_mobile.webp -> 1080x1920 (FHD portrait)...")
upscale_and_sharpen(
    src_path=os.path.join(assets, 'hero_banner_mobile.webp'),
    out_path=os.path.join(assets, 'hero_banner_mobile.webp'),
    new_size=(1080, 1920),
    sharpness=1.2,
    unsharp_radius=1.0,
    unsharp_percent=110,
    unsharp_threshold=2,
    quality=91
)

print("\nDone! Hero images upscaled and sharpened.")
