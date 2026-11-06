#import <AppKit/AppKit.h>
#include <napi.h>

#include <cstring>

namespace {

// BrowserWindow.getNativeWindowHandle() returns a Buffer holding an NSView*.
NSWindow* WindowFromHandle(const Napi::Buffer<uint8_t>& handle) {
  void* view_pointer = nullptr;
  std::memcpy(&view_pointer, handle.Data(), sizeof(view_pointer));
  NSView* view = (__bridge NSView*)view_pointer;
  return view.window;
}

Napi::Value SetOpaqueBackground(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 2 || !info[0].IsBuffer() || !info[1].IsBoolean()) {
    Napi::TypeError::New(env, "Expected (handle: Buffer, opaque: boolean)")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  auto handle = info[0].As<Napi::Buffer<uint8_t>>();
  if (handle.Length() != sizeof(void*)) {
    Napi::TypeError::New(env, "Expected the Buffer returned by "
                              "BrowserWindow.getNativeWindowHandle()")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  // AppKit may only be used on the main thread, where Electron runs the main
  // process's JavaScript. Worker threads would get here on another thread.
  if (![NSThread isMainThread]) {
    Napi::Error::New(env, "Must be called on the main thread")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  NSWindow* window = WindowFromHandle(handle);
  if (!window) {
    Napi::Error::New(env, "The native view is not attached to a window")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  // With a clear background, the window server derives the shadow from the
  // window's content, which continuously costs significant GPU time. An opaque
  // background gives the window a regular frame shadow instead, and is not
  // visible behind a vibrant view that covers the whole window.
  bool opaque = info[1].As<Napi::Boolean>().Value();
  window.backgroundColor =
      opaque ? NSColor.windowBackgroundColor : NSColor.clearColor;

  return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("setOpaqueBackground",
              Napi::Function::New(env, SetOpaqueBackground));
  return exports;
}

}  // namespace

NODE_API_MODULE(electron_vibrancy_gpu_fix, Init)
