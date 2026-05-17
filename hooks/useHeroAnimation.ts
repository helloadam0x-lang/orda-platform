import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
export function useHeroAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo('.hero-badge',
      { opacity: 0, y: -16, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )
    .fromTo('.hero-title-1',
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out' },
      '-=0.2'
    )
    .fromTo('.hero-title-2',
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out' },
      '-=0.7'
    )
    .fromTo('.hero-sub',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero-buttons',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo('.hero-phone',
      { opacity: 0, scale: 1.15, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'power3.out' },
      '-=1.2'
    )
  }, [])
  return ref
}
