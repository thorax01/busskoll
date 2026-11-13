"""Ritar appikonerna icon-192.png och icon-512.png (kör: python scripts/ikoner.py)."""
from PIL import Image, ImageDraw

def rita(storlek):
    s = storlek / 512
    img = Image.new("RGB", (storlek, storlek), "#12141b")
    d = ImageDraw.Draw(img)
    # Sol som går upp bakom bussen
    d.ellipse([196 * s, 70 * s, 396 * s, 270 * s], fill="#f0c04a")
    # Röd SL-buss
    d.rounded_rectangle([86 * s, 190 * s, 426 * s, 380 * s], radius=34 * s, fill="#d71d24")
    for x in (116, 206, 296):
        d.rounded_rectangle([x * s, 218 * s, (x + 76) * s, 286 * s], radius=10 * s, fill="#cfe3f5")
    for cx in (160, 352):
        d.ellipse([(cx - 34) * s, 352 * s, (cx + 34) * s, 420 * s], fill="#2a2e3b")
    return img

for n in (192, 512):
    rita(n).save(f"icon-{n}.png")
