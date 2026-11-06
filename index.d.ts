/**
 * Sets the macOS window background of a transparent `BrowserWindow` to an
 * opaque color, or back to clear.
 *
 * Electron gives transparent windows a clear `NSWindow` background, which makes
 * WindowServer derive the window shadow from the window's content and keep
 * recomputing it. That continuously costs a lot of GPU time. With an opaque
 * background, the window gets a regular frame shadow instead.
 *
 * Only use `opaque: true` on a frameless window whose vibrancy covers the whole
 * window, so the opaque background stays hidden behind the vibrancy view.
 * Call it again with `false` before removing vibrancy with `setVibrancy(null)`.
 *
 * Does nothing on platforms other than macOS.
 * Must be called from the main process, on its main thread, and never after
 * the window is destroyed: the handle then points to freed memory.
 *
 * @param handle - The Buffer returned by `BrowserWindow.getNativeWindowHandle()`
 * @param opaque - `true` for `NSColor.windowBackgroundColor`, `false` for `NSColor.clearColor`
 * @throws TypeError if `handle` is not a native window handle
 * @throws Error if the native view is not attached to a window
 */
export function setOpaqueBackground(handle: Buffer, opaque: boolean): void
