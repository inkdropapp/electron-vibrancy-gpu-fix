{
  "targets": [
    {
      "target_name": "electron_vibrancy_gpu_fix",
      "conditions": [
        ['OS=="mac"', {
          "sources": [
            "src/addon.mm"
          ],
          "include_dirs": [
            "<!(node -p \"require('node-addon-api').include_dir\")"
          ],
          "defines": [
            "NAPI_DISABLE_CPP_EXCEPTIONS"
          ],
          "xcode_settings": {
            "CLANG_ENABLE_OBJC_ARC": "YES",
            "MACOSX_DEPLOYMENT_TARGET": "13.0",
            "OTHER_CFLAGS": ["-arch x86_64", "-arch arm64"],
            "OTHER_LDFLAGS": ["-arch x86_64", "-arch arm64"]
          },
          "link_settings": {
            "libraries": [
              "-framework", "AppKit"
            ]
          }
        }]
      ]
    }
  ]
}
