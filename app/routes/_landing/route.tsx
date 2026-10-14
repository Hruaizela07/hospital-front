import type { LenisRef } from 'lenis/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import LandingNav from '~/components/common/landing-nav'
import LoaderAnime from '~/routes/landing-loader/loader-anime'
import { waitForLandingAssets } from './asset-readiness'
import Video from './video'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

export default function Landing() {
  const lenisRef = useRef<LenisRef>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const entranceRef = useRef<gsap.core.Timeline | null>(null)
  const hasRevealedRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [assetsReady, setAssetsReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!mainRef.current)
      return
    const controller = new AbortController()
    void waitForLandingAssets(mainRef.current, controller.signal).then(() => {
      if (!controller.signal.aborted)
        setAssetsReady(true)
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

      const entrance = gsap.timeline({ paused: isLoading })
      entranceRef.current = entrance

      entrance.fromTo('[data-landing-nav]', {
        yPercent: -100,
        autoAlpha: 0,
      }, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.75,
        ease: 'power3.out',
      }, 0)

      entrance.fromTo('[data-landing-video]', {
        scale: 1.08,
        autoAlpha: 0.35,
      }, {
        scale: 1,
        autoAlpha: 1,
        duration: 1.4,
        ease: 'power2.out',
      }, 0)
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
      }, 0.15)
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
      }, 0.5)

      if (hasRevealedRef.current)
        entrance.progress(1)

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

    return () => media.revert()
  }, { scope: mainRef, dependencies: [assetsReady], revertOnUpdate: true })

  function revealLanding() {
    hasRevealedRef.current = true
    entranceRef.current?.play()
    setIsLoading(false)
  }

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
        <LoaderAnime overlayOnly ready={assetsReady} onComplete={revealLanding} />
        <div className="min-h-screen" ref={mainRef} inert={isLoading} aria-busy={isLoading}>
          <LandingNav />
          <section className="
            sticky top-0 z-0 flex h-screen w-full flex-col items-center
            justify-center overflow-hidden
          "
          >
            <div
              data-landing-heading
              className="z-3 font-surfer text-6xl font-bold text-green-600"
            >
              CHOA Arthur M. Blank Hospital
            </div>
            <div data-landing-logo className="z-3 size-52">
              <img src="/logo2.png" alt="logo" className="size-full" />
            </div>
            <div className="absolute z-1 h-screen w-full bg-black/30" />
            <div data-landing-video className="absolute z-0 size-full h-screen">
              <Video />
            </div>

          </section>
          <section
            data-landing-secondary
            className="
              relative z-10 flex h-screen w-full items-center justify-center
              bg-red-400
            "
          >
            <div>
              <img src="/logo.png" alt="" />
            </div>
            <div
              onClick={() => navigate('/landing-loader')}
              className="border p-7"
            >
              CLick
            </div>
            <div>box 2</div>
          </section>
        </div>
      </div>
    </ReactLenis>
  )
}
