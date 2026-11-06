# @inkdropapp/electron-vibrancy-gpu-fix

Reduces WindowServer GPU load of transparent Electron windows with vibrancy on macOS.

## The problem

Electron gives every `transparent: true` window a clear `NSWindow` background.
With a fully clear background, macOS derives the window shadow from the window's content and keeps recomputing it, even when nothing on screen changes.
A frameless window with `vibrancy` then costs WindowServer a lot of GPU time, which drains battery.

The upstream fix is [electron/electron#55642](https://github.com/electron/electron/pull/55642).
This module applies the same change from your app until it ships in the Electron version you use.

## What it does

It sets the window background to `NSColor.windowBackgroundColor`.
The vibrancy view covers the whole frameless window, so the background stays hidden and the window looks the same.
The window gets a regular frame shadow instead of a content-derived one.

## Install

```sh
npm install @inkdropapp/electron-vibrancy-gpu-fix
```

The package ships a prebuilt universal (arm64 + x64) binary built with Node-API, so it needs no compiler and works across Electron versions.

## Usage

Call it in the main process right after creating the window:

```js
const { BrowserWindow } = require('electron')
const { setOpaqueBackground } = require('@inkdropapp/electron-vibrancy-gpu-fix')

const win = new BrowserWindow({
  frame: false,
  transparent: true,
  vibrancy: 'under-window'
})
setOpaqueBackground(win.getNativeWindowHandle(), true)
```

- Only use it on frameless windows whose vibrancy covers the whole window.
- Before removing vibrancy with `win.setVibrancy(null)`, call `setOpaqueBackground(handle, false)` to restore the clear background.
- If vibrancy fades in with an animation, call it after the animation ends.
- Don't call it after the window is destroyed.
- On other platforms it does nothing.

## Build

```sh
npm install
npm run build
npm test
```

## License

MIT
