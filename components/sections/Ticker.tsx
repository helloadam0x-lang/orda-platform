'use client'

const cities = [
  'New York', 'London', 'Dubai', 'Tokyo', 'Lagos', 'Paris',
  'Toronto', 'Sydney', 'Singapore', 'Nairobi', 'Berlin', 'Mumbai'
]

const doubleCities = [...cities, ...cities]

export default function Ticker() {
  return (
    <div className="relative py-5 overflow-hidden border-y border-white/5">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-0 whitespace-nowrap"
        style={{ animation: 'ticker 30s linear infinite' }}
      >
        {doubleCities.map((city, i) => (
          <span key={i} className="flex items-center gap-4 px-4">
            <span className="text-sm font-medium text-text-muted tracking-wider uppercase">{city}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent/50 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
