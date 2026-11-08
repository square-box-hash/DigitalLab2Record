# Self-hosted 3D models

The instrument room draws its own hand cursor over a model only when the model
is rendered here rather than inside Sketchfab's iframe. That needs the `.glb`
in this folder.

## screw-gauge.glb

| | |
|---|---|
| Source | [Screw gauge](https://sketchfab.com/3d-models/screw-gauge-ca68f5092e1646d58533a0fc0b38fa55) by [VeeRuby Technologies Pvt Ltd](https://sketchfab.com/veerubyinc) |
| Licence | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — credit required, commercial use allowed |
| Geometry | 20,819 faces, 14,941 vertices, 1 material, no textures |
| Changes | Compressed for the web (meshopt/Draco) before committing |

### Getting the file

Sketchfab only serves downloads to a signed-in account, so this one step has to
be done by hand:

1. Open the model page and choose **Download 3D Model** → **glTF** (or GLB).
2. Unzip it and take the `.glb`, or convert the glTF folder with
   `npx gltf-transform copy in.gltf screw-gauge.glb`.
3. Optionally shrink it: `npx gltf-transform optimize in.glb screw-gauge.glb --compress meshopt`.
   The viewer loads plain `GLTFLoader`, so keep the compression to meshopt or
   none — a Draco-only file will not open.
4. Drop the result in this folder as `screw-gauge.glb`.

### If the file is missing

Nothing breaks. The card's viewer fails to load the model and falls back to the
Sketchfab embed, exactly as before — you just lose the custom cursor for that
instrument.

### CC BY obligations

The credit line on the card already names the author and links the model page,
and appends "CC BY 4.0, compressed for the web". If you swap the model for
another, update `INSTRUMENTS` in `src/components/InstrumentExplorerView.tsx`
and keep the attribution honest.
