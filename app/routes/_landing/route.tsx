import { ReactLenis } from 'lenis/react'
import { useRef } from 'react'
import Video from './video'

export default function Landing() {
  const lenisRef = useRef(null)
  // const mainRef = useRef<HTMLDivElement>(null)

  return (
    <ReactLenis root options={{ anchors: true }} ref={lenisRef}>
      <div className="min-h-screen">
        <section className="
          flex h-screen w-full items-center justify-center border
        "
        >
          <Video />

        </section>
        <section className="
          flex h-screen w-full items-center justify-center bg-red-400
        "
        >
          <div>box 2</div>
        </section>
      </div>
    </ReactLenis>
  )
}
