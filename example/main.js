'use strict'

// Opens windows with Inkdrop's acrylic window options to compare GPU load and
// appearance with and without the fix.
//
// Environment variables:
//   FIX=1          apply setOpaqueBackground (default: off)
//   WINDOWS=<n>    number of windows (default: 1)
//   MAXIMIZE=1     maximize the windows (default: off)
//   APPEARANCE=light|dark  force the system appearance (default: system)

const { app, BrowserWindow, nativeTheme } = require('electron')
const { setOpaqueBackground } = require('..')

const isFixEnabled = process.env.FIX === '1'
const windowCount = Number(process.env.WINDOWS ?? '1')
const shouldMaximize = process.env.MAXIMIZE === '1'

const PAGE_HTML = `
<body style="margin: 0; font: 14px system-ui; display: flex; height: 100vh; color: CanvasText; color-scheme: light dark">
  <aside style="width: 220px; background: rgba(128, 128, 128, 0.15); padding: 48px 16px">Sidebar</aside>
  <main style="flex: 1; background: Canvas; padding: 48px 24px">
    <h1>Acrylic window</h1>
    <p>fix: ${isFixEnabled ? 'on' : 'off'}</p>
  </main>
</body>`

function createAcrylicWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    frame: false,
    titleBarStyle: 'hiddenInset',
    visualEffectState: 'active',
    transparent: true,
    backgroundColor: '#00000000',
    vibrancy: 'under-window'
  })
  if (isFixEnabled) {
    setOpaqueBackground(win.getNativeWindowHandle(), true)
  }
  if (shouldMaximize) {
    win.maximize()
  }
  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(PAGE_HTML)}`)
  // screencapture -l takes the CGWindowID from "window:<id>:0".
  console.log(`window ${win.getMediaSourceId()}`)
}

app.whenReady().then(() => {
  if (process.env.APPEARANCE) {
    nativeTheme.themeSource = process.env.APPEARANCE
  }
  for (let i = 0; i < windowCount; i++) {
    createAcrylicWindow()
  }
  // Launched from a terminal, the app would otherwise open behind other apps.
  app.focus({ steal: true })
})
