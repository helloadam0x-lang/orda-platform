'use client'

import { useRef, useCallback } from 'react'
import { gsap } from 'gsap'

export function useCardTilt(maxDeg = 8) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotationY: x * maxDeg * 2,
      rotationX: -y * maxDeg * 2,
      transformPerspective: 800,
      ease: 'power1.out',
      duration: 0.3,
    })
  }, [maxDeg])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    gsap.to(el, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
