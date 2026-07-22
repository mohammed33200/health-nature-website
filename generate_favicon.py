from PIL import Image, ImageDraw
import os

size = 256
img = Image.new('RGBA', (size, size), (0,0,0,0))
d = ImageDraw.Draw(img)

for y in range(size):
    t = y / (size - 1)
    r = int(15 + (94 - 15) * t)
    g = int(118 + (234 - 118) * t)
    b = int(110 + (212 - 110) * t)
    d.line([(0, y), (size, y)], fill=(r, g, b, 255))

mask = Image.new('L', (size, size), 0)
md = ImageDraw.Draw(mask)
md.rounded_rectangle([(24, 24), (size - 24, size - 24)], radius=28, fill=255)
img.putalpha(mask)

offset_x = 32
offset_y = 36
points = [(0, 0), (12, 48), (24, 24), (36, 48), (48, 0)]
translated = [(offset_x + x, offset_y + y) for x, y in points]
d.line(translated, fill=(255, 255, 255, 240), width=24)
d.line([(88, 38), (88, 70), (96, 90)], fill=(255, 255, 255, 240), width=24)
d.ellipse([(38, 34), (50, 46)], fill=(255, 255, 255, 240))

ico_path = os.path.join(os.path.dirname(__file__), 'public', 'favicon.ico')
img.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print('Saved', ico_path)
