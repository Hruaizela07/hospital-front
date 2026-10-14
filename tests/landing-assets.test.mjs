import assert from 'node:assert/strict'
import { test } from 'node:test'
import { waitForLandingAssets } from '../app/routes/_landing/asset-readiness.ts'

function rootWith(images, videos, fonts = Promise.resolve()) {
  return {
    querySelectorAll: selector => selector === 'img' ? images : videos,
    ownerDocument: { fonts: { ready: fonts } },
  }
}

test('waits for image decoding, fonts, and a video frame', async () => {
  const image = Object.assign(new EventTarget(), { complete: false, naturalWidth: 100 })
  const video = Object.assign(new EventTarget(), { readyState: 0 })
  let decode
  let loadFonts
  image.decode = () => new Promise((resolve) => {
    decode = resolve
  })
  const fonts = new Promise((resolve) => {
    loadFonts = resolve
  })
  let ready = false
  const waiting = waitForLandingAssets(rootWith([image], [video], fonts), new AbortController().signal)
    .then(() => { ready = true })

  image.dispatchEvent(new Event('load'))
  await Promise.resolve()
  video.dispatchEvent(new Event('loadeddata'))
  loadFonts()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(ready, false)
  decode()
  await waiting
  assert.equal(ready, true)
})

test('accepts cached assets and failed assets', async () => {
  const image = Object.assign(new EventTarget(), { complete: true, naturalWidth: 0 })
  const video = Object.assign(new EventTarget(), { readyState: 0 })
  const waiting = waitForLandingAssets(rootWith([image], [video]), new AbortController().signal)
  video.dispatchEvent(new Event('error'))
  await waiting
  await waitForLandingAssets(rootWith([], [{ readyState: 2 }]), new AbortController().signal)
})

test('releases stalled assets on timeout or cancellation', async () => {
  const root = rootWith([], [Object.assign(new EventTarget(), { readyState: 0 })])
  await waitForLandingAssets(root, new AbortController().signal, 10)
  const controller = new AbortController()
  const waiting = waitForLandingAssets(root, controller.signal)
  controller.abort()
  await waiting
})
