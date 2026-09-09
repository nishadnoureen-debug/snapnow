#!/usr/bin/env python
"""
Automated minification script for Snapnow:
Compresses css/style.css -> css/style.min.css and js/script.js -> js/script.min.js
"""
import os, sys

try:
    import rcssmin, rjsmin
except ImportError:
    print("Installing rcssmin and rjsmin...")
    os.system(f"{sys.executable} -m pip install rcssmin rjsmin")
    import rcssmin, rjsmin

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Minify CSS
css_in = os.path.join(root, 'css', 'style.css')
css_out = os.path.join(root, 'css', 'style.min.css')
with open(css_in, 'r', encoding='utf-8') as f:
    css_data = f.read()
min_css = rcssmin.cssmin(css_data)
with open(css_out, 'w', encoding='utf-8') as f:
    f.write(min_css)
print(f"CSS: {len(css_data):,} B -> {len(min_css):,} B (-{(1-len(min_css)/len(css_data))*100:.1f}%)")

# Minify JS
js_in = os.path.join(root, 'js', 'script.js')
js_out = os.path.join(root, 'js', 'script.min.js')
with open(js_in, 'r', encoding='utf-8') as f:
    js_data = f.read()
min_js = rjsmin.jsmin(js_data)
with open(js_out, 'w', encoding='utf-8') as f:
    f.write(min_js)
print(f"JS:  {len(js_data):,} B -> {len(min_js):,} B (-{(1-len(min_js)/len(js_data))*100:.1f}%)")
print("Minification complete!")
