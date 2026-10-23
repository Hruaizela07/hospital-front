/* eslint-disable better-tailwindcss/no-unknown-classes */
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import './triket-styel.css'

gsap.registerPlugin(useGSAP)

// Adjust offsetX and offsetY to move each strand without changing its shape.
// Path and bulb coordinates use the 522 × 162 SVG viewBox below.
const lightStrands = [
  {
    side: 'left',
    offsetX: 0,
    offsetY: 0,
    path: 'M 216 91 C 195 123 161 151 126 151',
    bulbs: [
      { x: 195, y: 119, color: '#ff4e54' },
      { x: 166, y: 143, color: '#ffd35a' },
    ],
  },
  {
    side: 'right',
    offsetX: 0,
    offsetY: 0,
    path: 'M 294 91 C 317 125 355 151 396 151',
    bulbs: [
      { x: 318, y: 121, color: '#6dd6ff' },
      { x: 354, y: 145, color: '#83e485' },
    ],
  },
]

export default function Heading() {
  const ticketsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const bulbs = gsap.utils.toArray<SVGElement>('[data-ticket-bulb]', ticketsRef.current)
    const glows = gsap.utils.toArray<SVGElement>('[data-ticket-glow]', ticketsRef.current)
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
        .to(bulbs, { opacity: 1, duration: 0.25, stagger: 0.15, ease: 'power1.out' }, 0)
        .to(glows, { opacity: 0.9, duration: 0.25, stagger: 0.15, ease: 'power1.out' }, 0)
        .to(bulbs, { opacity: 0.65, duration: 0.8, stagger: 0.15, ease: 'sine.out' }, 0.3)
        .to(glows, { opacity: 0.2, duration: 0.8, stagger: 0.15, ease: 'sine.out' }, 0.3)
    })

    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(bulbs, { opacity: 1 })
      gsap.set(glows, { opacity: 0.65 })
    })

    return () => media.revert()
  }, { scope: ticketsRef })

  return (
    <div className="
      relative flex h-screen w-full flex-col items-center justify-center border
    "
    >
      <div className="absolute top-50 z-1 flex" ref={ticketsRef}>
        <img src="tc1.png" alt="" className="mint-triket" />
        <img
          src="tc2.png"
          alt=""
          className="pink-triket -translate-y-16 translate-z-3"
        />
        <img src="tc3.png" alt="" className="red-triket" />
        <svg
          className="
            pointer-events-none absolute inset-0 top-60 z-10 overflow-visible
          "
          width="522"
          height="162"
          viewBox="0 0 522 162"
          aria-hidden="true"
        >
          {lightStrands.map(strand => (
            <g
              key={strand.side}
              transform={`translate(${strand.offsetX} ${strand.offsetY})`}
            >
              <path
                d={strand.path}
                fill="none"
                stroke="#355b35"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {strand.bulbs.map(bulb => (
                <g key={bulb.x} transform={`translate(${bulb.x} ${bulb.y})`}>
                  <circle
                    data-ticket-glow
                    cx="0"
                    cy="9"
                    r="12"
                    fill={bulb.color}
                    opacity="0.2"
                    style={{ filter: 'blur(5px)' }}
                  />
                  <g data-ticket-bulb opacity="0.65">
                    <rect x="-3" y="-1" width="6" height="5" rx="1" fill="#355b35" />
                    <path d="M -5 5 Q -5 3 0 3 Q 5 3 5 5 Q 5 10 0 14 Q -5 10 -5 5 Z" fill={bulb.color} />
                  </g>
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>
      <div className="absolute top-70 z-1 size-16 transform-3d">
        <img
          src="/santa-hat.png"
          alt=""
          className="santa-hat"
        />
      </div>
      <div className="absolute top-60 z-0 h-40 transform-3d">
        <div className="circle-ground size-60 border bg-gray-200" />
      </div>

      <div className="
        box absolute top-80 z-1 w-64 rounded-sm border-2 border-[#F7D6D0]
        bg-[#FFF5F5] px-4 py-2 text-center text-lg font-semibold text-[#6E3511]
      "
      >
        Good plans start here.
      </div>

      <div className="absolute top-24">
        <div className="size-70 rounded-full border bg-gray-200" />
      </div>
    </div>
  )
}
