import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function revealSection(el: Element, delay = 0) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 70 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay,
      scrollTrigger: { trigger: el, start: 'top 82%' },
    }
  )
}

export function revealClipUp(el: Element | null, delay = 0) {
  if (!el) return
  gsap.fromTo(
    el,
    { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.9,
      ease: 'power4.out',
      delay,
    }
  )
}

export function staggerReveal(els: Element[], delay = 0) {
  gsap.fromTo(
    els,
    { opacity: 0, y: 60, rotation: 2 },
    {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.08,
      delay,
      scrollTrigger: { trigger: els[0], start: 'top 80%' },
    }
  )
}

export function countUp(
  target: number,
  setter: (v: number) => void,
  triggerEl: Element,
  duration = 2.2
) {
  const obj = { val: 0 }
  ScrollTrigger.create({
    trigger: triggerEl,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        val: target,
        duration,
        ease: 'power2.out',
        onUpdate: () => setter(Math.round(obj.val)),
        onComplete: () => setter(target),
      })
    },
  })
}
