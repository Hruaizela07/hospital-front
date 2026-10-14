/* eslint-disable better-tailwindcss/no-unknown-classes */

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useEffect, useRef } from 'react'
import LandingNav from '~/components/common/landing-nav'

gsap.registerPlugin(useGSAP, SplitText)

interface LoaderAnimeProps {
  overlayOnly?: boolean
  ready?: boolean
  onComplete?: () => void
}

export default function LoaderAnime({ overlayOnly = false, ready = true, onComplete }: LoaderAnimeProps) {
  const mainRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const readyRef = useRef(ready)
  const waitingRef = useRef(false)

  useEffect(() => {
    readyRef.current = ready
    if (ready && waitingRef.current) {
      waitingRef.current = false
      timelineRef.current?.play()
    }
  }, [ready])

  useGSAP(() => {
    const select = gsap.utils.selector(mainRef)
    const navAnchors = select('[data-navigation-link]')
    const navLogo = select('[data-navigation-logo]')
    const navLinks = navAnchors.length
      ? SplitText.create(navAnchors, { type: 'words', mask: 'words', wordsClass: 'nav-word' })
      : null

    const heading = overlayOnly
      ? null
      : SplitText.create(select('.hero-header h1'), {
          type: 'lines, words, chars',
          charsClass: 'char',
          wordsClass: 'word',
        })

    if (heading) {
      gsap.set('[data-landing-nav]', { autoAlpha: 0 })
      gsap.set(heading.chars, { y: 50, opacity: 0, scale: 0.5 })
      gsap.set('.hero-image img', { autoAlpha: 0 })
    }
    if (navLogo.length)
      gsap.set(navLogo, { scale: 0 })
    if (navLinks)
      gsap.set(navLinks.words, { yPercent: 100 })

    const itemTargets = [
      { x: '-20vw', y: '-30vh', rotation: -20 },
      { x: '25vw', y: '-20vh', rotation: 15 },
      { x: '-32vw', y: '30vh', rotation: 12 },
      { x: '15vw', y: '25vh', rotation: 15 },
    ]

    const EXIT_DISTANCE = 3.5
    const itemExits = itemTargets.map(target => ({
      x: `${Number.parseFloat(target.x) * EXIT_DISTANCE}vw`,
      y: `${Number.parseFloat(target.y) * EXIT_DISTANCE}vh`,
      rotation: target.rotation * 2.5,
    }))

    const items = gsap.utils.toArray<HTMLElement>(select('.item'))
    const floatingTweens: gsap.core.Tween[] = []

    const tl = gsap.timeline({ delay: 0.5 })
    timelineRef.current = tl

    tl.to('.preloader-revealer', {
      clipPath: 'circle(100% at 50% 50%)',
      duration: 1,
      stagger: 0.25,
      ease: 'power2.inOut',
    })

    tl.set('.preloader-revealer', { display: 'none' })

    items.forEach((item, i) => {
      const target = itemTargets[i]
      const image = item.querySelector('img') as HTMLImageElement

      tl.to(item, {
        x: target.x,
        y: target.y,
        rotation: target.rotation,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        onStart: () => {
          floatingTweens[i] = gsap.to(image, {
            y: gsap.utils.random(-15, -25),
            duration: gsap.utils.random(1.5, 2.5),
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: gsap.utils.random(0, 0.5),
          })
        },
      }, i === 0 ? '-=0.55' : '<0.075')
    })

    tl.to('.preloader-logo', {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    }, '<')

    tl.set('.preloader-bg', { display: 'none' })

    tl.to({}, { duration: 1 })

    tl.addPause('>', () => {
      if (readyRef.current)
        tl.play()
      else
        waitingRef.current = true
    })

    tl.add(() => floatingTweens.forEach(tween => tween.kill()))

    items.forEach((item, i) => {
      const exit = itemExits[i]

      tl.to(item, {
        x: exit.x,
        y: exit.y,
        rotation: exit.rotation,
        duration: 0.75,
        ease: 'power2.in',
      }, i === 0 ? '>' : '<0.075')
    })

    tl.to('.preloader-logo', {
      y: '-120vh',
      scale: 2.5,
      duration: 0.75,
      ease: 'power2.in',
    }, '<')

    if (!overlayOnly && heading) {
      tl.set('[data-landing-nav]', { autoAlpha: 1 }, '-=0.4')
      // Preserve the reveal timing even while the optional navigation is absent.
      tl.to(navLogo.length ? navLogo : { scale: 1 }, {
        scale: 1,
        duration: 0.75,
        ease: 'power3.out',
      }, '-=0.4')

      tl.to(navLinks?.words.length ? navLinks.words : { yPercent: 0 }, {
        yPercent: 0,
        duration: 0.75,
        stagger: 0.05,
        ease: 'power3.out',
      }, '<0.1')

      tl.to(heading.chars, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        stagger: 1.5,
        ease: 'elastic.out(0.75,0.25)',
      }, '<0.2')

      tl.to('.hero-image-bg', {
        scale: 1,
        duration: 1,
        ease: 'power3.in',
      }, '<0.1')

      tl.to('.hero-image img', {
        y: '-50%',
        autoAlpha: 1,
        duration: 1,
        ease: 'power3.out',
      }, '>')
    }

    tl.set('.preloader', { display: 'none' })
    if (onComplete)
      tl.call(onComplete)

    return () => {
      timelineRef.current = null
      waitingRef.current = false
      // These tweens are created later by onStart, outside the hook's context.
      floatingTweens.forEach(tween => tween.revert())
      navLinks?.revert()
      heading?.revert()
    }
  }, { scope: mainRef })

  return (
    <div ref={mainRef} className="loader-anime">
      <div className="preloader" style={{ inset: 0, zIndex: 50, backgroundColor: overlayOnly ? '#000' : undefined }} aria-hidden="true">
        <div className="preloader-bg" style={{ backgroundColor: '#000' }}></div>
        <div className="preloader-revealer preloader-revealer-1"></div>
        <div className="preloader-revealer preloader-revealer-2"></div>
        <div className="preloader-revealer preloader-revealer-3"></div>
        <div className="preloader-revealer preloader-revealer-4"></div>

        <div className="items">
          <div className="item item-1"><img src="/logo2.png" alt="Image 1" /></div>
          <div className="item item-2"><img src="/logo2.png" alt="Image 2" /></div>
          <div className="item item-3"><img src="/logo2.png" alt="Image 3" /></div>
          <div className="item item-4"><img src="/logo2.png" alt="Image 4" /></div>
        </div>

        <div className="preloader-logo"><img src="/logo2.png" alt="Image" /></div>
      </div>
      {!overlayOnly && <LandingNav />}
      {!overlayOnly && (
        <section className="hero">
          <div className="hero-header"><h1>CHOA Arthur M. Blank Hospital</h1></div>
          <div className="hero-image">
            <div className="hero-image-bg"></div>
            <img src="/logo2.png" alt="logo" />
          </div>
        </section>
      )}
    </div>
  )
}
