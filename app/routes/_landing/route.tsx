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
import LandingTicker from './landing-ticker'
import Video from './video'

gsap.registerPlugin(useGSAP, Draggable, ScrollTrigger, SplitText)

// const carouselImages = [
//   { id: 'hospital', txt: '/3274796391d671a82bc53c3035606c48.jpg' },
//   { id: 'house-one', txt: '/landscape.jpg' },
//   { id: 'interior', txt: '/cc.jpg' },
//   { id: 'house-two', txt: '/house\'.jpg' },
// ]

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

      gsap.fromTo(select('[data-landing-ticker-item]'), {
        y: 24,
        autoAlpha: 0,
      }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: select('[data-landing-ticker]')[0],
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
            className="relative z-4 min-h-lvh w-full bg-[#FBE6C2]"
          >

            <div className="flex min-h-lvh flex-col justify-between">
              <LandingTicker />

              <div
                className="
                  flex min-h-120 w-full shrink-0 flex-col gap-8 px-6 py-16
                  lg:flex-row lg:justify-between lg:gap-12 lg:px-16 lg:pt-40
                  2xl:px-50 2xl:pt-44
                "
                data-landing-secondary
              >
                <h2 className="
                  fontAnton text-4xl font-bold
                  md:text-5xl
                "
                >
                  EXPLORE OUR FACILITIES
                </h2>
                <p className="JetBrainsMono max-w-xl text-xl">
                  Take a closer look at CHOA Arthur M. Blank Hospital through
                  images of the spaces and facilities where children and
                  families spend time.
                </p>
              </div>
              <div
                data-landing-secondary
                ref={carouselRef}
                className="
                  w-full shrink-0 cursor-grab overflow-hidden
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
                      className="flex shrink-0 items-baseline"
                      aria-hidden={copy === 1}
                    >
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
          <div className="
            relative inset-0 z-2 flex size-full flex-col bg-[#FBE6C2]
          "
          >

            <section
              className="
                relative mt-40 flex h-lvh w-full items-center gap-10
                bg-[#FBE6C2]
              "
            >
              <div
                className="
                  mx-auto flex size-full max-w-410 flex-col items-center
                  rounded-3xl border-8 border-[#15370D]
                "
                style={{ backgroundImage: 'url(\'/public/unsplash.jpg\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', borderRadius: '30px', objectFit: 'cover' }}
              >

                <h2 className="pt-60 pb-20 font-surfer text-5xl font-bold">MAKE AN APPOINTMENT </h2>
                <div className="
                  mx-auto flex w-full max-w-4xl flex-col items-center
                  justify-center rounded-xl border-8 border-[#15370D]
                  bg-[#5D9253] px-10 py-20
                "
                >
                  <h3 className="
                    mb-4 text-center text-3xl font-bold text-[#15370D]
                  "
                  >
                    Your care starts here
                  </h3>
                  <p className="
                    JetBrainsMono max-w-xl px-6 text-center text-white
                  "
                  >
                    Ready to take the next step in your care? Book an appointment
                    with our team at a time that works for you.
                  </p>
                  <div
                    className="mt-10 flex justify-center"
                  >

                    <button
                      onClick={() => navigate('/appointment')}
                      className="
                        rounded-2xl border-2 border-[#15370D] bg-[#15370D] px-7
                        py-2 text-xl font-bold text-white
                        hover:cursor-pointer hover:bg-green-600
                      "
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>

            </section>
            <section className="
              relative z-4 grid grid-cols-3 bg-[#FBE6C2] px-10 py-20
            "
            >
              <div className="col-span-1 font-bold text-[#15370D]">
                <div>Home</div>
                <div>About</div>
                <div>Appointment</div>
                <div>Contact</div>
                <div className="border" onClick={() => navigate('/gsap')}>
                  Gsap
                </div>
                <div
                  className="hover:cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  Login
                </div>
              </div>
              <div className="
                col-span-1 flex flex-col items-center justify-center
              "
              >
                <div

                  className="
                    z-3 flex flex-col items-center font-surfer text-4xl
                    font-bold text-[#15370D]
                  "
                >
                  <p>CHOA Arthur</p>
                  <p>M. Blank Hospital</p>
                </div>
                <div

                  className="
                    z-3 size-32
                    lg:size-42
                  "
                >
                  <img src="/logo2.png" alt="logo" className="size-full" />
                </div>
              </div>
              <div className="col-span-1 flex w-full justify-end text-[#15370D]">
                <div className="max-w-xs text-right">
                  <h2 className="font-surfer text-2xl font-bold">
                    Here for your care
                  </h2>
                  <p className="JetBrainsMono mt-4 text-sm/6 text-[#15370D]">
                    Take the next step with our team. Explore the site or book an
                    appointment when you are ready.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </ReactLenis>
  )
}
