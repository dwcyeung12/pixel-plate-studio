# Pixel Plate Studio

A browser-based generator for 3D-printable pixel-style name and number plates. Enter text, preview the design, and export an STL. The app runs entirely in your browser and works with any 3D printer that can fit the model.

## Use the generator

Open the hosted site or download the latest release, extract it, and open `index.html` in a modern browser. No installation, account, backend, or internet connection is needed after the files are downloaded.

1. Enter up to 32 characters: letters, numbers, spaces, `+`, `-`, `.` and `/`.
2. Use the icon buttons to insert a heart (`!`), smile (`@`), sad face (`#`), or phone (`$`). Letters are converted to uppercase.
3. Leave plate length blank for automatic sizing, or enter a custom length in millimetres. The length and width scale together; thickness remains 3 mm. Check the displayed dimensions against your printer's build area.
4. Choose preview colours, then select **Export STL**. The STL contains geometry only; colours are not embedded.
5. Open the STL in your slicer, select your printer and material, and place the plate flat on the build plate. Check the toolpath preview before printing.

## Two-colour printing

The base is 2 mm thick. The raised text, icons, and border occupy the next 1 mm. For two colours, configure your slicer to change filament after the base is complete and before the first raised layer. With 0.2 mm layers, this is normally the layer at 2.2 mm; verify the exact transition in the slicer preview. The text and border will be the same colour using this method.

## Host your own copy

This is a static website: `index.html`, `style.css`, `font.js` and `app.js` are the complete application. Upload them together to a static host such as Cloudflare Pages. No build command or server-side code is required. For Git integration, use the repository root as the site directory; new commits can trigger deployments automatically.

## Notes

- The preview is a top view; the exported plate has a flat base and raised pixels.
- Pixel size changes when you adjust the plate length. Verify small features in your slicer, particularly with larger nozzles.
- A long plate may exceed your printer's build area. Reduce its length or use a larger printer.
- Your text stays in your browser; no plate content is sent to a server by the application.
