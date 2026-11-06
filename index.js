'use strict'

const binding =
  process.platform === 'darwin' ? require('node-gyp-build')(__dirname) : null

function setOpaqueBackground(handle, opaque) {
  if (binding) {
    binding.setOpaqueBackground(handle, opaque)
  }
}

module.exports = { setOpaqueBackground }
