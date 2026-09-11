#!/usr/bin/env python
"""Add loading=lazy to non-critical images in all HTML files."""
import glob, re

for fname in glob.glob('*.html'):
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content

    def add_lazy(m):
        tag = m.group(0)
        # Skip if already has loading attribute
        if 'loading=' in tag:
            return tag
        # Skip hero banner images (they are above the fold)
        if 'fetchpriority' in tag or 'hero_banner' in tag:
            return tag
        # Skip logo images in navbar (above the fold, critical)
        if 'logo-img' in tag or 'logo_white' in tag or 'logo_black' in tag:
            return tag
        # Add lazy loading before closing >
        return tag.replace('<img ', '<img loading="lazy" ')

    content = re.sub(r'<img\s[^>]+>', add_lazy, content)

    if content != original:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated: ' + fname)
    else:
        print('No change: ' + fname)

print('Done.')
