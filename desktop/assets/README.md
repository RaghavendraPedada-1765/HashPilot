# HashPilot Desktop — Icon Assets

Place these files here:

| File | Size | Format | Used by |
|------|------|--------|---------|
| `icon.ico` | 256×256 (multi-res) | ICO | Windows taskbar, installer, Start Menu |
| `icon.png` | 512×512 | PNG | electron-builder (auto-converts to .ico) |
| `icon.icns` | 512×512 | ICNS | macOS (future) |

## Converting icon.png → icon.ico

Install ImageMagick, then run:

```powershell
magick icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

Or use an online converter: https://convertico.com

## Quick Option
If you don't have ImageMagick, electron-builder can auto-convert `icon.png` to
`.ico` on Windows when the PNG is at least 256×256.  Just rename `icon.png` 
references in `package.json` to `icon.png` and electron-builder handles the rest.
