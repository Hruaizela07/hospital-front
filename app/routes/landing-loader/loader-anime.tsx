/* eslint-disable better-tailwindcss/no-unknown-classes */

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, SplitText)

export default function LoaderAnime() {
  const mainRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const navLinks = SplitText.create('nav a', { type: 'lines', mask: 'words', wordsClass: 'nav-word' })

    const heading = SplitText.create('.hero-header h1', {
      type: 'lines, words, chars',
      charsClass: 'char',
      wordsClass: 'word',
    })

    gsap.set(heading.chars, { y: 50, opacity: 0, scale: 0.5 })

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

    const items = gsap.utils.toArray('.item') as HTMLElement[]
    const floatingTweens: gsap.core.Tween[] = []

    const tl = gsap.timeline({ delay: 0.5 })

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

    tl.to('.nav-logo img', {
      scale: 1,
      duration: 0.75,
      ease: 'power3.out',
    }, '-=0.4')

    tl.to(navLinks.words, {
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
      duration: 1,
      ease: 'power3.out',
    }, '<0.3')

    tl.set('.preloader', { display: 'none' })
  }, [])

  return (
    <div ref={mainRef} className="loader-anime">
      <div className="preloader">
        <div className="preloader-bg"></div>
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
      {/* <nav>
        <div className="nav-logo">
          <img src="/logo2.png" alt="" />
        </div>
        <div className="nav-items">
          <a href="#">Home</a>
          <a href="#">Home</a>
          <a href="#">Home</a>
          <a href="#">Home</a>
          <a href="#">Home</a>
        </div>
      </nav> */}
      <section className="hero">
        <div className="hero-header"><h1>CHOA Arthur M. Blank Hospital</h1></div>
        <div className="hero-image">
          <div className="hero-image-bg"></div>
          <img src="/logo2.png" alt="logo" />
        </div>
      </section>
    </div>
  )
}
