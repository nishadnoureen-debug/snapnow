#!/usr/bin/env python
"""
Aggressive sharpening pass for hero banner images.
Applies multi-stage sharpening to recover clarity lost from multiple resize cycles.
"""
import os
from PIL import Image, ImageEnhance, ImageFilter

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
assets = os.path.join(root, 'assets')

def sharpen_aggressively(src_path, out_path, quality=93):
    img = Image.open(src_path).convert('RGB')
    orig_size = img.size
    print(f"  Input:  {orig_size[0]}x{orig_size[1]} @ {os.path.getsize(src_path)//1024}KB")

    # === PASS 1: Strong UnsharpMask — recovers edges ===
    img = img.filter(ImageFilter.UnsharpMask(radius=2.5, percent=200, threshold=2))

    # === PASS 2: Detail enhancement ===
    img = img.filter(ImageFilter.DETAIL)

    # === PASS 3: Second UnsharpMask — fine-grain crispness ===
    img = img.filter(ImageFilter.UnsharpMask(radius=0.8, percent=100, threshold=1))

    # === PASS 4: Sharpness enhancer ===
    img = ImageEnhance.Sharpness(img).enhance(1.7)

    # === PASS 5: Slight contrast pop ===
    img = ImageEnhance.Contrast(img).enhance(1.10)

    # === PASS 6: Slight color vibrance ===
    img = ImageEnhance.Color(img).enhance(1.05)

    img.save(out_path, 'WEBP', quality=quality, method=6)
    print(f"  Output: {img.size[0]}x{img.size[1]} @ {os.path.getsize(out_path)//1024}KB")

print("Sharpening desktop hero_banner.webp ...")
sharpen_aggressively(
    src_path=os.path.join(assets, 'hero_banner.webp'),
    out_path=os.path.join(assets, 'hero_banner.webp'),
    quality=93
)

print("\nSharpening mobile hero_banner_mobile.webp ...")
sharpen_aggressively(
    src_path=os.path.join(assets, 'hero_banner_mobile.webp'),
    out_path=os.path.join(assets, 'hero_banner_mobile.webp'),
    quality=92
)

print("\nDone! Hero images aggressively sharpened.")
