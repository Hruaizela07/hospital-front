import type { ComponentRef } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { useEffect, useRef } from 'react'

export default function Video({ playing }: { playing: boolean }) {
  const playerRef = useRef<ComponentRef<typeof MuxPlayer>>(null)

  useEffect(() => {
    const player = playerRef.current
    if (playing && player)
      void player.play().catch(() => {})
  }, [playing])

  return (
    <MuxPlayer
      ref={playerRef}
      streamType="on-demand"
      playbackId="6NW9S9wkU7fgj01qkQ5vP7012vjoMGGmBHiwSNAYkxXcA"
      poster=""
      muted
      loop
      nohotkeys
      minResolution="1080p"
      maxResolution="1080p"
    />
  )
}
