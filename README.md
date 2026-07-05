# OmniForge Studio Website

Static Vite website for Vercel deployment.

## Local development

```powershell
npm run dev
```

## Build

```powershell
npm run build
```

## Download URLs

The live buttons are configured through Vite environment variables in `.env.example`.

- `VITE_WINDOWS_INSTALLER_URL`
- `VITE_EXTENSION_ZIP_URL`

For a fully free setup, put files in `public/downloads/` or point the variables at another public free host.

Expected local files:

- `public/downloads/OmniForge-Studio-Setup.exe`
- `public/downloads/omniforge-browser-bridge.zip`

The browser extension ZIP is included. The Windows installer still needs to be generated from the desktop app build and placed at the expected path, or provided through `VITE_WINDOWS_INSTALLER_URL`.
