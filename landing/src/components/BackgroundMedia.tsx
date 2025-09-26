'use client'

import { usePathname } from 'next/navigation'

export default function BackgroundMedia() {
  const pathname = usePathname()
  const isHome = pathname === '/'

//   if (isHome) {
//     return (
//       <video
//         autoPlay
//         muted
//         loop
//         playsInline
//         preload="auto"
//         src="/omniscient-full.mp4"
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',
//           zIndex: -1,
//         }}
//       />
//     )
//   }

  return (
    <img
      src="/omniscient-compressed.png"
      alt="Background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1,
      }}
    />
  )
}


