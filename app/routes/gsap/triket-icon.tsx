import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

gsap.registerPlugin(useGSAP)

const lightColors = ['#ff4e54', '#ffd35a', '#6dd6ff', '#83e485', '#f99bff']

export default function TriketIcon() {
  const strandRef = useRef<HTMLDivElement>(null)
  const [strandWidth, setStrandWidth] = useState(900)

  useEffect(() => {
    const strand = strandRef.current
    if (!strand)
      return

    const observer = new ResizeObserver(([entry]) => {
      setStrandWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(strand)

    return () => observer.disconnect()
  }, [])

  const lightCount = Math.max(6, Math.ceil(strandWidth / 58))
  const spacing = strandWidth / lightCount
  const lights = Array.from({ length: lightCount }, (_, index) => ({
    x: spacing * (index + 0.5 + [0, -0.08, 0.06, -0.04, 0.09][index % 5]),
    y: index % 2 === 0 ? 45 + (index % 3) * 3 : 72 + (index % 4) * 2,
    color: lightColors[index % lightColors.length],
    pointsUp: index % 2 === 0,
  }))

  const wirePoints = [{ x: 0, y: 60 }, ...lights, { x: strandWidth, y: 60 }]
  const wireSegments = wirePoints.slice(1).map((point, index) => {
    const previous = wirePoints[index]
    const bend = (point.x - previous.x) * 0.38
    return `M ${previous.x} ${previous.y} C ${previous.x + bend} ${previous.y}, ${point.x - bend} ${point.y}, ${point.x} ${point.y}`
  })
  const wirePath = wireSegments.join(' ')
  const frontWirePath = wireSegments.filter((_, index) => index % 2 === 1).join(' ')

  useGSAP(() => {
    const bulbs = gsap.utils.toArray<SVGElement>('[data-christmas-bulb]', strandRef.current)
    const glows = gsap.utils.toArray<SVGElement>('[data-christmas-glow]', strandRef.current)
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
      timeline
        .to(bulbs, { opacity: 1, duration: 0.18, stagger: 0.11, ease: 'power1.out' }, 0)
        .to(glows, { opacity: 0.85, duration: 0.18, stagger: 0.11, ease: 'power1.out' }, 0)
        .to(bulbs, { opacity: 0.6, duration: 0.8, stagger: 0.11, ease: 'sine.out' }, 0.2)
        .to(glows, { opacity: 0.14, duration: 0.8, stagger: 0.11, ease: 'sine.out' }, 0.2)
    })

    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(bulbs, { opacity: 1 })
      gsap.set(glows, { opacity: 0.65 })
    })

    return () => media.revert()
  }, { scope: strandRef, dependencies: [lightCount], revertOnUpdate: true })

  return (
    <main
      className="flex min-h-screen w-full items-center overflow-hidden bg-white"
    >
      <div className="relative h-[120px] w-full" ref={strandRef}>
        <svg
          className="absolute inset-0 size-full overflow-visible"
          viewBox={`0 0 ${strandWidth} 120`}
          aria-hidden="true"
        >
          <path d={wirePath} fill="none" stroke="#728E6D" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <div
          className="absolute top-[52px] h-[18px] w-full"
          style={{ backgroundImage: 'url(\'/ticket-loop.png\')', backgroundRepeat: 'repeat-x' }}
        />
        <svg
          className="absolute inset-0 size-full overflow-visible"
          viewBox={`0 0 ${strandWidth} 120`}
          aria-hidden="true"
        >
          <path d={frontWirePath} fill="none" stroke="#728E6D" strokeWidth="5" strokeLinecap="round" />
          <path d={frontWirePath} fill="none" stroke="#52724c" strokeWidth="2" strokeLinecap="round" />
          {lights.map(light => (
            <g key={light.x} transform={`translate(${light.x} ${light.y}) rotate(${light.pointsUp ? 180 : 0})`}>
              <circle
                data-christmas-glow
                cx="0"
                cy="18"
                r="22"
                fill={light.color}
                opacity="0.14"
                style={{ filter: 'blur(9px)' }}
              />
              <g data-christmas-bulb opacity="0.6">
                <rect x="-5" y="-1" width="10" height="10" rx="2" fill="#183b2d" stroke="#7a9873" strokeWidth="1.5" />
                <path d="M -8 13 Q -8 7 0 7 Q 8 7 8 13 Q 8 20 0 29 Q -8 20 -8 13 Z" fill={light.color} />
                <path d="M -4 12 Q -3 9 0 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              </g>
            </g>
          ))}
        </svg>
      </div>
    </main>
  )
}
