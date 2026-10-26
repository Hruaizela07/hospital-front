/* eslint-disable better-tailwindcss/no-unknown-classes */
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import './triket-styel.css'

gsap.registerPlugin(useGSAP)

const snowflakes = [
  { id: 'small1', x: 10, y: 174, size: 24 },
  { id: 'small2', x: 320, y: 254, size: 24 },
  { id: 'small3', x: 500, y: 264, size: 24 },
  { id: 'large1', x: 95, y: 104, size: 44 },
  { id: 'large2', x: 340, y: 102, size: 42 },
]

// Adjust offsetX and offsetY to move each strand without changing its shape.
// Path and bulb coordinates use the 522 × 162 SVG viewBox below.
const lightStrandRight = [

  {
    side: 'right',
    offsetX: 60,
    offsetY: 60,
    // path: 'M 294 91 C 317 125 355 151 396 151',
    path: 'M 294 91 C 314 124 354 144 461 150',
    bulbs: [
      { x: 316, y: 116, color: '#6dd6ff', rotate: 30 },
      { x: 354, y: 131, color: '#83e485', rotate: 200 },
      { x: 395, y: 145, color: '#f99bff', rotate: 15 },
      { x: 436, y: 147, color: '#ffd35a', rotate: 180 },
    ],
  },
]

const lightStrandLeft = [
  {
    side: 'left',
    offsetX: -30,
    offsetY: 34,
    path: 'M 216 91 C 195 123 124 167 40 172',
    bulbs: [
      { x: 195, y: 116, color: '#ff4e54', rotate: -40 },
      { x: 166, y: 133, color: '#ffd35a', rotate: 140 },
      { x: 125, y: 155, color: '#6dd6ff', rotate: -20 },
      { x: 80, y: 164, color: '#83e485', rotate: 160 },
    ],
  },
]

export default function Heading() {
  const headingRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const bulbs = gsap.utils.toArray<SVGElement>('[data-ticket-bulb]', headingRef.current)
    const glows = gsap.utils.toArray<SVGElement>('[data-ticket-glow]', headingRef.current)
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
  }, { scope: headingRef })

  return (
    <div
      ref={headingRef}
      className="
        relative flex h-screen w-full flex-col items-center justify-center
        border
      "
    >
      <div className="absolute top-50 z-1 flex">
        <img src="tc1.png" alt="" className="mint-triket" />
        <img
          src="tc2.png"
          alt=""
          className="pink-triket -translate-y-16 translate-z-3"
        />
        <img src="tc3.png" alt="" className="red-triket" />
      </div>
      <svg
        className="pointer-events-none absolute top-0 z-10 overflow-visible"
        width="522"
        height="162"
        viewBox="0 0 522 162"
        aria-hidden="true"
      >
        {lightStrandLeft.map(strand => (
          <g
            key={strand.side}
            transform={`translate(${strand.offsetX} ${strand.offsetY})`}
          >
            <path
              d={strand.path}
              fill="none"
              stroke="#AAB99A"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {strand.bulbs.map(bulb => (
              <g key={bulb.x} transform={`translate(${bulb.x} ${bulb.y}) rotate(${bulb.rotate})`}>
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
        {lightStrandRight.map(strand => (
          <g
            key={strand.side}
            transform={`translate(${strand.offsetX} ${strand.offsetY})`}
          >
            <path
              d={strand.path}
              fill="none"
              stroke="#AAB99A"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {strand.bulbs.map(bulb => (
              <g key={bulb.x} transform={`translate(${bulb.x} ${bulb.y}) rotate(${bulb.rotate})`}>
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
        {snowflakes.map(item => (
          <svg
            key={item.id}
            x={item.x}
            y={item.y}
            width={item.size}
            height={item.size}
            viewBox="200 200 1600 1600"
          >
            <path
              d="M 988 235 L 968 248 L 959 267 L 959 794 L 721 558 L 706 552 L 691 552 L 675 559 L 661 576 L 659 601 L 669 620 L 975 926 L 993 933 L 1004 933 L 1023 926 L 1332 617 L 1338 607 L 1340 585 L 1329 563 L 1315 554 L 1292 552 L 1275 560 L 1041 794 L 1040 275 L 1037 259 L 1025 243 L 1010 235 Z M 584 658 L 563 669 L 554 683 L 552 705 L 558 720 L 795 958 L 267 959 L 252 965 L 239 979 L 235 989 L 235 1009 L 248 1030 L 268 1039 L 794 1039 L 556 1281 L 552 1293 L 552 1307 L 560 1325 L 577 1338 L 600 1340 L 622 1328 L 921 1029 L 930 1016 L 933 993 L 926 975 L 616 665 L 600 658 Z M 1398 658 L 1379 668 L 1074 973 L 1069 981 L 1065 999 L 1069 1017 L 1075 1026 L 1379 1330 L 1391 1338 L 1414 1340 L 1433 1331 L 1445 1314 L 1446 1290 L 1440 1277 L 1205 1039 L 1731 1039 L 1745 1034 L 1757 1023 L 1765 1008 L 1765 990 L 1752 969 L 1732 959 L 1205 959 L 1440 721 L 1447 700 L 1442 678 L 1433 667 L 1422 660 Z M 992 1066 L 975 1073 L 668 1380 L 660 1394 L 659 1416 L 666 1431 L 682 1444 L 702 1447 L 723 1439 L 958 1203 L 959 1724 L 962 1740 L 973 1755 L 990 1765 L 1009 1765 L 1032 1749 L 1040 1727 L 1040 1205 L 1280 1442 L 1303 1447 L 1314 1445 L 1326 1438 L 1338 1422 L 1340 1399 L 1330 1379 L 1023 1072 L 1007 1066 Z"
              fill="#FAE251"
              stroke="#FAE251"
              strokeWidth="0.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ))}
      </svg>
      <div className="absolute top-70 z-1 size-16 transform-3d">
        <img
          src="/santa-hat.png"
          alt=""
          className="santa-hat"
        />
      </div>
      <div className="absolute top-60 z-0 h-40 transform-3d">
        <div className="circle-ground size-60 border bg-[#E8EDF2]" />
      </div>

      <div className="
        box absolute top-80 z-1 w-64 rounded-sm border-2 border-[#F7D6D0]
        bg-[#FFF5F5] px-4 py-2 text-center text-lg font-semibold text-[#6E3511]
      "
      >
        Good plans start here.
      </div>

      <div className="absolute top-24">
        <div className="
          size-70 rounded-full border border-[#E8EDF2] bg-[#E8EDF2]
        "
        />
      </div>
    </div>
  )
}
