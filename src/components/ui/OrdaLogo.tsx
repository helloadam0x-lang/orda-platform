export function OrdaLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span
      style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900,
        fontSize: size === 'sm' ? '18px' : size === 'lg' ? '48px' : '26px',
        letterSpacing: '0.08em',
        color: '#EFEFEF',
        lineHeight: 1,
      }}
    >
      ORDA
      <span style={{ color: '#D4A853', marginLeft: '2px' }}>.</span>
    </span>
  )
}
