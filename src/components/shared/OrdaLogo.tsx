export function OrdaLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const px = size === 'sm' ? 18 : size === 'lg' ? 48 : 26
  const dotSize = Math.round(px * 0.22)
  const dotOffset = Math.round(px * 0.06)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', lineHeight: 1 }}>
      <span style={{
        fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)',
        fontWeight: 900,
        fontSize: px,
        letterSpacing: '0.08em',
        color: '#EFEFEF',
        lineHeight: 1,
      }}>
        ORDA
      </span>
      <span style={{
        width: dotSize,
        height: dotSize,
        borderRadius: '50%',
        background: '#D4A853',
        display: 'inline-block',
        flexShrink: 0,
        marginBottom: dotOffset,
        boxShadow: '0 0 8px rgba(212,168,83,0.5)',
      }} />
    </span>
  )
}
