'use client'

import { Marquee } from '@/components/ui/marquee'

const cities = [
  'New York', 'London', 'Dubai', 'Tokyo', 'Paris',
  'Toronto', 'Sydney', 'Singapore', 'Berlin', 'Mumbai',
  'São Paulo', 'Seoul', 'Amsterdam', 'Cape Town', 'Lagos',
  'Nairobi', 'Mexico City', 'Jakarta',
]

export default function CityTicker() {
  return (
    <div style={{
      background: '#050505',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '14px 0',
      overflow: 'hidden',
    }}>
      <Marquee pauseOnHover className='[--duration:50s]'>
        {cities.map(city => (
          <span key={city} style={{
            marginRight: '48px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.18)',
          }}>
            {city} <span style={{ color: 'rgba(0,255,102,0.3)', marginLeft: '48px' }}>·</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
