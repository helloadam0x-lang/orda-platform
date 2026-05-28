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
      background: '#050507',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '18px 0',
      overflow: 'hidden',
    }}>
      <Marquee pauseOnHover className='[--duration:50s]'>
        {cities.map(city => (
          <span key={city} style={{
            marginRight: '48px',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(239,239,239,0.2)',
          }}>
            {city} <span style={{ color: 'rgba(212,168,83,0.4)', marginLeft: '48px' }}>·</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
