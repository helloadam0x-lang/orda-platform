'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const ringX = useMotionValue(-100)
  const ringY = useMotionValue(-100)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const rX = useSpring(ringX, { stiffness: 400, damping: 28, mass: 0.5 })
  const rY = useSpring(ringY, { stiffness: 400, damping: 28, mass: 0.5 })
  const dX = useSpring(dotX, { stiffness: 600, damping: 35, mass: 0.2 })
  const dY = useSpring(dotY, { stiffness: 600, damping: 35, mass: 0.2 })

  const ringRef = useRef<HTMLDivElement>(null)
  const isHover = useRef(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      ringX.set(e.clientX - 5)
      ringY.set(e.clientY - 5)
      dotX.set(e.clientX - 2)
      dotY.set(e.clientY - 2)
    }
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const hit = el.closest('a, button, [data-hover]')
      if (hit && !isHover.current) {
        isHover.current = true
        if (ringRef.current) {
          ringRef.current.style.width = '28px'
          ringRef.current.style.height = '28px'
          ringRef.current.style.marginLeft = '-9px'
          ringRef.current.style.marginTop = '-9px'
          ringRef.current.style.opacity = '0.25'
          ringRef.current.style.background = 'rgba(212,168,83,0.6)'
        }
      } else if (!hit && isHover.current) {
        isHover.current = false
        if (ringRef.current) {
          ringRef.current.style.width = '10px'
          ringRef.current.style.height = '10px'
          ringRef.current.style.marginLeft = '0px'
          ringRef.current.style.marginTop = '0px'
          ringRef.current.style.opacity = '0.7'
          ringRef.current.style.background = 'rgba(239,239,239,0.8)'
        }
      }
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [ringX, ringY, dotX, dotY])

  return (
    <>
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: rX, y: rY,
          width: 10, height: 10,
          background: 'rgba(239,239,239,0.8)',
          opacity: 0.7,
          transition: 'width 200ms cubic-bezier(0.23,1,0.32,1), height 200ms cubic-bezier(0.23,1,0.32,1), opacity 200ms, background 200ms',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dX, y: dY,
          width: 4, height: 4,
          background: '#D4A853',
          opacity: 0.9,
        }}
      />
    </>
  )
}
