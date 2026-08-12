# assets

Sources, not output. Nothing here is served or bundled — Next only serves
`public/` — so this is where an original lives when the file the site actually
uses is a derivative of it.

## portrait-original.jpg

340x604, the uncropped frame. `public/portrait.jpg` is this with 120px taken
off the top, which is what [Portrait.tsx](../src/components/Portrait.tsx)
samples into ASCII. Recrop from here rather than from the cropped copy:

```bash
node -e 'require("sharp")("assets/portrait-original.jpg")
  .extract({ left: 0, top: 120, width: 340, height: 484 })
  .jpeg({ quality: 88 })
  .toFile("public/portrait.jpg")'
```

Changing the crop changes the aspect: `WIDTH`/`HEIGHT` in Portrait.tsx are
stated so the column reserves its space before the image loads, and they have
to be updated to match or the ASCII grid stretches.
