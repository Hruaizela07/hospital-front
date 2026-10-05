/* eslint-disable better-tailwindcss/no-unknown-classes */

import { useGSAP } from '@gsap/react'
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

    const footerText = SplitText.create('.hero-footer p', {
      type: 'lines',
      mask: 'lines',
      lineClass: 'footer-line',
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
    const floatingTweens = []
  }, [])

  return (
    <div>
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

      </nav> */}
      <section className="hero">
        <div className="hero-header">CHOA Arthur M. Blank Hospital</div>
        <div className="hero-image">
          <img src="/logo2.png" alt="logo" />
        </div>
      </section>
    </div>
  )
}
