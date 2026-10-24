# Dayboard

Dayboard is a local-first macOS desktop planner with a deliberately neo-brutalist visual system.

## Run locally

```bash
npm install
npm start
```

## Build the macOS installer

On a Mac, run:

```bash
npm install
npm run dist
```

The generated `.dmg` will be in `dist/`.

## Project structure

- `main.js` — Electron main process and native notifications
- `preload.js` — secure renderer bridge
- `index.html`, `renderer.js`, and CSS files — app UI and behavior
- `build/icon.svg` and `build/icon-1024.png` — neo-brutalist app icon sources

## Releasing updates

Increase the version in `package.json`, run `npm run dist`, and publish the resulting DMG as a GitHub Release. Automatic in-app updates are not enabled yet; adding `electron-updater` with signed GitHub Releases is the next step for a Check for Updates button.

## Included in this first build

- Month calendar with previous/next navigation and a jump-to-today action.
- Selected-day workspace with task checklist and completion progress.
- Time blocks with start/end times and color accents.
- Per-day notes tab with autosave.
- Full-screen notes focus mode with page themes, image/video/audio/file attachments, and URL/media embeds.
- Reminder choices on tasks and time blocks with themed in-app toasts and macOS notifications while Dayboard is running.
- Tasks show their scheduled time directly in the checklist, with a reminder sound when the alert fires.
- Local persistence through the browser storage inside the desktop app.
- Native Electron window configuration and electron-builder DMG configuration.
