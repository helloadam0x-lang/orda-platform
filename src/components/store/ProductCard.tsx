import { formatCurrency } from '@/lib/format'

interface ProductCardProps {
  id: string
  slug: string
  name: string
  price: number
  compareAtPrice?: number | null
  imageUrl?: string | null
  currency: string
  inStock?: boolean
  isFeatured?: boolean
  onSale?: boolean
}

export function ProductCard({ id, slug, name, price, compareAtPrice, imageUrl, currency, inStock = true, isFeatured, onSale }: ProductCardProps) {
  return (
    <a
      href={`/store/${slug}/product/${id}`}
      style={{
        background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)',
        overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block',
        opacity: inStock ? 1 : 0.6,
        transition: 'box-shadow 200ms, transform 200ms',
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.boxShadow = ''
        el.style.transform = ''
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {imageUrl
          ? <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 48 }}>📦</span>}
        {onSale && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: '#EF4444', color: '#fff', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>SALE</div>
        )}
        {isFeatured && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: '#D4A853', color: '#fff', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>⭐</div>
        )}
        {!inStock && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Out of Stock</span>
          </div>
        )}
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#D4A853' }}>{formatCurrency(price, currency)}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>{formatCurrency(compareAtPrice, currency)}</span>
          )}
        </div>
      </div>
    </a>
  )
}
