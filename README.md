# Pixel Plate Studio

A browser-based generator for 3D-printable pixel-style name and number plates. Create a model, preview it in 3D, and download STL files. The app runs entirely in your browser and is not tied to a printer brand.

**Use it online:** [3dmodel.publicwc.uk](https://3dmodel.publicwc.uk/)

## Create a plate

1. Enter up to 32 letters, numbers or spaces. The characters `+`, `-`, `.`, and `/` are also supported. Letters become uppercase.
2. Add an icon with the buttons. Draw a custom 8 × 8 icon or import an image to convert it to pixels, then select **Custom** to insert it. Conversion runs locally; edit the pixels to improve the result.
3. Choose a pixel lettering style, plate length, base thickness, raised height, and mounting option. Hole dimensions scale with the plate, so check their final size in your slicer.
4. Optionally enter your printer's X and Y bed dimensions to check whether the plate fits, including a 90-degree rotation. The check does not account for brims, margins or machine-specific restrictions.
5. Drag the 3D preview to rotate it and use the zoom slider. The preview uses the same geometry as the exported model. Inspect the STL and toolpaths in your slicer before printing.
6. Select **Export STL** for a combined model. Choose your printer and material in your slicer and print the base flat.

Preview colours are for visualisation only: STL files do not store colour assignments. Pixel size changes with the plate length; check that small features can be printed with your nozzle.

## Two-colour printing and stands

For a single-colour printer, change filament after the base is complete and before the first raised layer; the base thickness is shown in the controls. Select a layer height that aligns with this transition and verify it in your slicer.

For a multicolour slicer, download the **base** and **raised** STLs and import them together as parts of one object, preserving their original positions. The raised part retains its height above the base. Assign each part a filament in the slicer and check alignment in the preview. Importing them individually with automatic centring or placing each part on the bed can break alignment.

The optional stand STL is a separate 45-degree dashboard support with an angled slot based on the selected base thickness plus 0.4 mm clearance. Print the stand flat with its wide base on the build plate; two stands may be useful for longer plates. Secure the supports to the dashboard and check the fit before printing several.

## Run offline or host

Download the latest release, extract the ZIP and open `index.html` in a modern browser. Once downloaded, no server, account or internet connection is needed. The files `index.html`, `style.css`, `font.js` and `app.js` form the static application; they can also be uploaded to a static website host with no build command or backend.
