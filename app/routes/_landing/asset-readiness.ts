/** Wait for the first usable hero frame, without blocking forever on failed assets. */
export function waitForLandingAssets(root: HTMLElement, signal: AbortSignal, timeoutMs = 12000): Promise<void> {
  return new Promise((resolve) => {
    const cleanups: (() => void)[] = []
    let finished = false
    const finish = () => {
      if (finished)
        return
      finished = true
      cleanups.forEach(cleanup => cleanup())
      resolve()
    }
    const timer = setTimeout(finish, timeoutMs)
    cleanups.push(() => clearTimeout(timer))
    signal.addEventListener('abort', finish, { once: true })
    cleanups.push(() => signal.removeEventListener('abort', finish))

    if (signal.aborted) {
      finish()
      return
    }

    const waitForEvent = (target: EventTarget, events: string[]) => new Promise<void>((done) => {
      const settle = () => {
        events.forEach(event => target.removeEventListener(event, settle))
        done()
      }
      events.forEach(event => target.addEventListener(event, settle, { once: true }))
      cleanups.push(settle)
    })

    const images = Array.from(root.querySelectorAll('img'), async (image) => {
      if (!image.complete)
        await waitForEvent(image, ['load', 'error'])
      if (!signal.aborted && !finished && image.naturalWidth > 0)
        await image.decode().catch(() => {})
    })
    const videos = Array.from(root.querySelectorAll<HTMLMediaElement>('mux-player, video'), (video) => {
      if (video.readyState >= 2 || video.error)
        return Promise.resolve()
      return waitForEvent(video, ['loadeddata', 'canplay', 'error'])
    })

    void Promise.allSettled([
      root.ownerDocument.fonts.ready,
      ...images,
      ...videos,
    ]).then(finish)
  })
}
