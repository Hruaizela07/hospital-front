/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { LenisRef } from 'lenis/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
// import LoaderAnime from '~/routes/landing-loader/loader-anime'
import { waitForLandingAssets } from './asset-readiness'
import Video from './video'

gsap.registerPlugin(useGSAP, Draggable, ScrollTrigger, SplitText)

const carouselImages = [
  { id: 'hospital', src: '/3274796391d671a82bc53c3035606c48.jpg' },
  { id: 'house-one', src: '/landscape.jpg' },
  { id: 'interior', src: '/cc.jpg' },
  { id: 'house-two', src: '/house\'.jpg' },
]

export default function Landing() {
  const lenisRef = useRef<LenisRef>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const carouselTrackRef = useRef<HTMLDivElement>(null)
  const carouselGroupRef = useRef<HTMLDivElement>(null)
  const entranceRef = useRef<gsap.core.Timeline | null>(null)
  const hasRevealedRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [assetsReady, setAssetsReady] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!mainRef.current)
      return
    const controller = new AbortController()
    void waitForLandingAssets(mainRef.current, controller.signal).then(() => {
      if (!controller.signal.aborted) {
        hasRevealedRef.current = true
        setAssetsReady(true)
        setIsLoading(false)
      }
    })
    return () => controller.abort()
  }, [])

  useGSAP(() => {
    if (!assetsReady)
      return

    const select = gsap.utils.selector(mainRef)
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const heading = SplitText.create(select('[data-landing-heading]'), {
        type: 'words,chars',
      })

      const entrance = gsap.timeline({ paused: true, onComplete: () => setVideoPlaying(true) })
      entranceRef.current = entrance

      entrance.fromTo('[data-landing-video]', {
        scale: 1.08,
        autoAlpha: 0.35,
      }, {
        scale: 1,
        autoAlpha: 1,
        duration: 1.4,
        ease: 'power2.out',
      }, 0)
      entrance.addLabel('backgroundDisplayed')
      entrance.fromTo(heading.chars, {
        y: 50,
        autoAlpha: 0,
        scale: 0.5,
      }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 1.2,
        stagger: { amount: 0.8 },
        ease: 'elastic.out(0.75,0.25)',
      }, 'backgroundDisplayed+=1')
      entrance.fromTo('[data-landing-logo]', {
        y: 40,
        scale: 0.7,
        autoAlpha: 0,
      }, {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 1,
        ease: 'power3.out',
      }, 'backgroundDisplayed+=1.35')

      if (hasRevealedRef.current)
        entrance.play()

      gsap.from('[data-landing-secondary] > *', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: select('[data-landing-secondary]')[0],
          start: 'top 80%',
          once: true,
        },
      })

      return () => {
        entranceRef.current = null
        heading.revert()
      }
    })

    media.add('(prefers-reduced-motion: reduce)', () => {
      setVideoPlaying(true)
    })

    return () => media.revert()
  }, { scope: mainRef, dependencies: [assetsReady], revertOnUpdate: true })

  useGSAP(() => {
    const viewport = carouselRef.current
    const track = carouselTrackRef.current
    const group = carouselGroupRef.current
    if (!viewport || !track || !group)
      return

    let cycleWidth = group.offsetWidth
    let position = 0
    let previousDragX = 0
    let dragging = false
    const wrap = () => gsap.utils.wrap(-cycleWidth, 0, position)
    const render = () => gsap.set(track, { x: wrap() })

    const resizeObserver = new ResizeObserver(() => {
      cycleWidth = group.offsetWidth
      if (cycleWidth)
        render()
    })
    resizeObserver.observe(group)

    const proxy = document.createElement('div')
    const [draggable] = Draggable.create(proxy, {
      type: 'x',
      trigger: viewport,
      onPress() {
        dragging = true
        previousDragX = this.x
      },
      onDrag() {
        position += this.x - previousDragX
        previousDragX = this.x
        render()
      },
      onRelease() {
        dragging = false
      },
    })

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const tick = (_time: number, deltaTime: number) => {
        if (!dragging && cycleWidth) {
          position -= deltaTime * 0.05
          render()
        }
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    })

    return () => {
      media.revert()
      draggable.kill()
      resizeObserver.disconnect()
    }
  }, { scope: mainRef })

  useEffect(() => {
    if (!isLoading)
      return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const lenis = lenisRef.current?.lenis
    lenis?.stop()

    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
    }
  }, [isLoading])

  return (
    <ReactLenis root options={{ anchors: true }} ref={lenisRef}>
      <div className="min-h-lvh w-full">
        {/* <LoaderAnime overlayOnly ready={assetsReady} onComplete={revealLanding} /> */}
        <div className="min-h-screen" ref={mainRef} inert={isLoading} aria-busy={isLoading}>

          <section
            className="
              sticky top-0 z-0 flex h-screen w-full flex-col overflow-hidden
            "
            style={{ visibility: assetsReady ? 'visible' : 'hidden' }}
          >

            <div className="
              flex h-screen w-full flex-col items-center justify-center
            "
            >
              <div
                data-landing-heading
                className="
                  strikeme z-3 hidden font-surfer text-6xl font-bold
                  text-green-800
                  lg:block
                "
              >
                CHOA Arthur M. Blank Hospital
              </div>
              <div
                data-landing-heading
                className="
                  strikeme z-3 flex flex-col items-center font-surfer text-4xl
                  font-bold
                  lg:hidden
                "
              >
                <p>CHOA Arthur</p>
                <p>M. Blank Hospital</p>
              </div>
              <div
                data-landing-logo
                className="
                  z-3 size-32
                  lg:size-52
                "
              >
                <img src="/logo2.png" alt="logo" className="size-full" />
              </div>
              <div className="absolute z-1 h-screen w-full bg-black/15" />
              <div
                data-landing-video
                className="absolute z-0 size-full h-screen"
              >
                <Video playing={videoPlaying} />
              </div>
            </div>
          </section>
          <section
            data-landing-secondary
            className="
              relative z-10 flex min-h-lvh w-full flex-col bg-[#FBE6C2]
            "
          >

            <div className="flex flex-col items-center justify-between">

              <div>box 2</div>
              <div
                ref={carouselRef}
                className="
                  w-full cursor-grab overflow-hidden
                  active:cursor-grabbing
                "
                aria-label="Hospital photo carousel; drag to browse"
              >
                <div
                  ref={carouselTrackRef}
                  className="flex w-max touch-pan-y select-none"
                >
                  {[0, 1].map(copy => (
                    <div
                      key={copy}
                      ref={copy === 0 ? carouselGroupRef : undefined}
                      className="flex shrink-0 border"
                      aria-hidden={copy === 1}
                    >
                      {/* {carouselImages.map(image => (
                        <img
                          key={image.id}
                          src={image.src}
                          alt=""
                          draggable={false}
                          className="
                            shrink-0 rounded-sm border-4 border-black
                            object-cover
                          "
                        />
                      ))} */}
                      <div className="mr-10 w-full">
                        <img
                          src="/3274796391d671a82bc53c3035606c48.jpg"
                          alt=""
                          className="
                            object-fit flex size-full h-110 shrink-0 gap-5
                            rounded-sm border-4 border-white
                          "
                          aria-hidden={copy === 1}
                        />
                      </div>

                      <div className="mr-10 w-full max-w-130">
                        <img
                          src="/landscape.jpg"
                          alt=""
                          className="
                            object-fit flex size-full h-80 shrink-0 gap-5
                            rounded-sm border-4 border-white
                          "
                          aria-hidden={copy === 1}
                        />
                      </div>

                      <div className="mr-10 w-full">
                        <img
                          src="/cc.jpg"
                          alt=""
                          className="
                            object-fit flex size-full h-110 shrink-0 gap-5
                            rounded-sm border-4 border-white
                          "
                          aria-hidden={copy === 1}
                        />
                      </div>

                      <div className="mr-10 w-full max-w-130">
                        <img
                          src="/landscape.jpg"
                          alt=""
                          className="
                            object-fit flex size-full h-80 shrink-0 gap-5
                            rounded-sm border-4 border-white
                          "
                          aria-hidden={copy === 1}
                        />
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section
            className="relative z-10 flex h-screen w-full flex-col bg-red-400"

          >
            <div
              onClick={() => navigate('/appointment')}
              className="p-7"
            >
              CLick
            </div>
          </section>
        </div>
      </div>
    </ReactLenis>
  )
}
