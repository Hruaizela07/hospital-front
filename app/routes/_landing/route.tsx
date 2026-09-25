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
          relative flex h-screen w-full flex-col items-center justify-center
        "
        >
          <div className="z-3 text-6xl font-bold text-green-600">
            CHOA Arthur M. Blank Hospital
          </div>
          <div className="z-3 size-52">
            <img src="/logo2.png" alt="logo" className="size-full" />
          </div>
          <div className="absolute z-1 h-screen w-full bg-black/30" />
          <div className="absolute z-0 size-full h-screen">
            <Video />
          </div>

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
