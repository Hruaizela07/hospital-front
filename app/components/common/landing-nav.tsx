import { Link } from 'react-router'

export default function LandingNav() {
  return (
    <nav
      aria-label="Main navigation"
      data-landing-nav
      className="
        fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-black/80
        text-white backdrop-blur-md
      "
    >
      <div className="
        mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3
        sm:px-8
      "
      >
        <Link
          to="/"
          aria-label="CHOA Arthur M. Blank Hospital home"
          className="
            flex min-w-0 items-center gap-3 rounded-md
            focus-visible:outline-2 focus-visible:outline-offset-4
            focus-visible:outline-white
          "
        >
          <img
            data-navigation-logo
            src="/logo2.png"
            alt=""
            className="size-10 shrink-0 object-contain"
          />
          <span className="
            hidden text-sm font-semibold
            sm:block
          "
          >
            CHOA Arthur M. Blank Hospital
          </span>
        </Link>
        <div className="
          flex shrink-0 items-center gap-5 text-sm font-medium
          sm:gap-8
        "
        >
          <Link
            data-navigation-link
            to="/"
            className="
              rounded-sm transition-colors
              hover:text-green-300
              focus-visible:outline-2 focus-visible:outline-offset-4
              focus-visible:outline-white
            "
          >
            Home
          </Link>
          <Link
            data-navigation-link
            to="/login"
            className="
              rounded-full border border-white/30 px-4 py-2 transition-colors
              hover:bg-white hover:text-black
              focus-visible:outline-2 focus-visible:outline-offset-4
              focus-visible:outline-white
            "
          >
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  )
}
