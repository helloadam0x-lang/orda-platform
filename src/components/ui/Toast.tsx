'use client'

import { useEffect, useState } from 'react'

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-[18px] py-[12px] rounded-[10px] bg-[rgba(37,211,102,0.10)] border border-[rgba(37,211,102,0.2)] text-[#25D366] text-[14px] font-medium shadow-lg transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      {message}
    </div>
  )
}
