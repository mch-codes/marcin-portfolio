"""Generates the decorative river SVGs behind the hero + about sections.
Re-run after editing: python3 scripts/river.py

Geometry: the pair's total width is GAP + 2*AMP viewBox units. The <img> is
sized in page.tsx so that span renders exactly as wide as the photo, and the
START (x=ANCHOR) is positioned on the photo's centre. Two variants because a
narrow viewport has far less room left of the centred photo than a wide one.
"""
import math

W, H   = 400, 2000
INK    = "#d4d4d4"
K      = 6          # wave periods over the run
AMP    = 20         # swing of each line
GAP    = 64         # distance between the two lines   -> extent = 64 + 40 = 104
ANCHOR = 300        # start x; page.tsx pins this to the photo centre

VARIANTS = {
    "river-wide.svg":   94,    # two-column layout: room to sweep to the page edge
    "river-narrow.svg": 212,   # single column: photo is centred, so a shorter lean
}

def smooth(t): return t*t*(3-2*t)

def build(x_bottom):
    x_top = ANCHOR - GAP/2
    def wave(offset, phase, step=6):
        pts, y = [], 0
        while y <= H:
            t = y/H
            cx = x_top + (x_bottom-GAP/2 - x_top)*smooth(t) + offset
            pts.append((round(cx + AMP*math.sin(2*math.pi*K*t + phase), 2), y))
            y += step
        return "M" + " L".join(f"{x},{y}" for x, y in pts)

    def ripple(cx, cy, w=26, amp=2.6, step=2):
        pts, x = [], -w/2
        while x <= w/2:
            pts.append((round(cx+x, 2), round(cy + amp*math.sin(2*math.pi*(x/(w/2))), 2)))
            x += step
        return "M" + " L".join(f"{a},{b}" for a, b in pts)

    paths = [f'<path d="{wave(0,0.0)}" />', f'<path d="{wave(GAP,0.35)}" />']
    for t in (0.10, 0.30, 0.50, 0.70, 0.90):
        cx = x_top + (x_bottom-GAP/2 - x_top)*smooth(t) + GAP/2
        paths.append(f'<path d="{ripple(round(cx,1), round(t*H,1))}" />')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'preserveAspectRatio="none" fill="none">\n'
            f'<g stroke="{INK}" stroke-width="7" stroke-linecap="round" '
            f'stroke-linejoin="round" vector-effect="non-scaling-stroke">\n'
            + "\n".join(paths) + "\n</g>\n</svg>\n")

for name, xb in VARIANTS.items():
    open(f"public/{name}", "w").write(build(xb))
    print(f"{name}: start {ANCHOR/W:.0%} -> end {xb/W:.0%} of its own width")
print(f"extent = {GAP + 2*AMP} units of {W}  =>  img width must be photo_width * {W/(GAP+2*AMP):.3f}")
