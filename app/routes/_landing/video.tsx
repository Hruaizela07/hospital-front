import MuxPlayer from '@mux/mux-player-react'

export default function Video() {
  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId="6NW9S9wkU7fgj01qkQ5vP7012vjoMGGmBHiwSNAYkxXcA"
      autoPlay="muted"
      muted
      loop
      nohotkeys
      minResolution="1080p"
      maxResolution="1080p"
    />
  )
}
