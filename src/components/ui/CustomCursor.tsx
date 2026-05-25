'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const springConfig = { damping: 24, stiffness: 200, mass: 0.6 }
  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  const dotSpring = { damping: 50, stiffness: 500, mass: 0.2 }
  const dotSpringX = useSpring(dotX, dotSpring)
  const dotSpringY = useSpring(dotY, dotSpring)

  const isHovering = useRef(false)
  const outerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
      dotX.set(e.clientX - 3)
      dotY.set(e.clientY - 3)
    }

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor="hover"]')) {
        isHovering.current = true
        outerRef.current?.classList.add('scale-[2.2]', 'opacity-30')
      } else {
        isHovering.current = false
        outerRef.current?.classList.remove('scale-[2.2]', 'opacity-30')
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [cursorX, cursorY, dotX, dotY])

  return (
    <>
      {/* Outer ring — spring lag */}
      <motion.div
        ref={outerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] transition-transform duration-200"
        style={{
          x: springX,
          y: springY,
          border: '1px solid rgba(192,132,252,0.5)',
          backgroundColor: 'transparent',
          mixBlendMode: 'normal',
        }}
      />
      {/* Inner dot — instant */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] bg-accent-light"
        style={{
          x: dotSpringX,
          y: dotSpringY,
          backgroundColor: '#C084FC',
        }}
      />
    </>
  )
}
