/* eslint-disable better-tailwindcss/no-unknown-classes */
import { Clock, Phone } from 'lucide-react'
import './landing-ticker.css'

const tickerItems = [
  { text: 'Follow us on Instagram' },
  { text: '1007-OCT', icon: Phone },
  { text: 'Follow us on Facebook' },
  { text: 'Best Hospital' },
  { text: 'Super Fast WIFI' },
  { text: '247 ACCESS', icon: Clock },
]

export default function LandingTicker() {
  return (
    <div data-landing-ticker className="landing-ticker h-18 bg-[#5D9253]">
      <div className="landing-ticker-track h-full">
        {[0, 1].map(copy => (
          <div
            key={copy}
            className="landing-ticker-group h-full"
            aria-hidden={copy === 1}
          >
            {tickerItems.map(({ text, icon: Icon }) => (
              <div
                key={text}
                data-landing-ticker-item
                className="
                  fontAnton landing-ticker-item gap-x-10 text-2xl font-bold
                "
              >
                {Icon && <Icon aria-hidden="true" />}
                {text}
              </div>
            ))}
            {/* <div
              data-landing-ticker-item
              className="
                fontAnton landing-ticker-item gap-x-10 text-2xl font-bold
              "
            >
              Follow us on Instagram
            </div>
            <div
              data-landing-ticker-item
              className="
                fontAnton landing-ticker-item gap-x-10 text-2xl font-bold
              "
            >
              1007-OCT
              <Phone />
            </div>
            <div
              data-landing-ticker-item
              className="
                fontAnton landing-ticker-item gap-x-10 text-2xl font-bold
              "
            >
              Follow us on Facebook
            </div>
            <div
              data-landing-ticker-item
              className="
                fontAnton landing-ticker-item gap-x-10 text-2xl font-bold
              "
            >
              Best Hospital
            </div>
            <div
              data-landing-ticker-item
              className="
                fontAnton landing-ticker-item gap-x-10 text-2xl font-bold
              "
            >
              Super Fast WIFI
            </div>
            <div
              data-landing-ticker-item
              className="
                fontAnton landing-ticker-item gap-x-10 text-2xl font-bold
              "
            >
              247 ACCESS
              {' '}
              <Clock />
            </div> */}
          </div>
        ))}
      </div>
    </div>
  )
}
