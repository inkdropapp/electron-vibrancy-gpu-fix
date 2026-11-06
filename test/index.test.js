'use strict'

const assert = require('node:assert/strict')
const { describe, it } = require('node:test')
const { setOpaqueBackground } = require('..')

const POINTER_SIZE = 8

describe('setOpaqueBackground', { skip: process.platform !== 'darwin' }, () => {
  it('rejects a handle that is not a Buffer', () => {
    assert.throws(() => setOpaqueBackground('handle', true), TypeError)
  })

  it('rejects a missing opaque flag', () => {
    assert.throws(() => setOpaqueBackground(Buffer.alloc(POINTER_SIZE)), TypeError)
  })

  it('rejects a Buffer of the wrong size', () => {
    assert.throws(() => setOpaqueBackground(Buffer.alloc(POINTER_SIZE - 1), true), TypeError)
  })

  it('rejects a handle without a window', () => {
    const nullViewHandle = Buffer.alloc(POINTER_SIZE)
    assert.throws(() => setOpaqueBackground(nullViewHandle, true), {
      message: 'The native view is not attached to a window'
    })
  })
})
