'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Upload, ArrowLeft, CheckCircle2, AlertCircle, FileText } from 'lucide-react'

interface CSVRow {
  name: string
  price: string
  description: string
  category: string
  stock: string
}

function parseCSV(text: string): CSVRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: any = {}
    headers.forEach((h, i) => { row[h] = vals[i] ?? '' })
    return {
      name: row['name'] ?? row['product name'] ?? row['product'] ?? '',
      price: row['price'] ?? row['amount'] ?? '',
      description: row['description'] ?? row['desc'] ?? '',
      category: row['category'] ?? row['type'] ?? '',
      stock: row['stock'] ?? row['quantity'] ?? row['qty'] ?? '',
    }
  }).filter(r => r.name && r.price)
}

export default function ImportProductsPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [rows, setRows] = useState<CSVRow[]>([])
  const [filename, setFilename] = useState('')
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    setError('')
    setRows([])
    setDone(false)
    setFilename(file.name)
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const parsed = parseCSV(e.target?.result as string)
        if (!parsed.length) { setError('No valid rows found. Check your CSV has Name and Price columns.'); return }
        setRows(parsed)
      } catch {
        setError('Could not parse CSV. Make sure it is a valid .csv file.')
      }
    }
    reader.readAsText(file)
  }, [])

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.csv')) handleFile(file)
    else setError('Please drop a .csv file.')
  }

  async function runImport() {
    if (!rows.length || importing) return
    setImporting(true)
    setProgress(0)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/sign-in'); return }
    const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', user.id).single()
    if (!biz) { setError('Business not found.'); setImporting(false); return }

    const batchSize = 10
    let inserted = 0
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize).map(r => ({
        business_id: biz.id,
        name: r.name,
        price: parseFloat(r.price.replace(/[^0-9.]/g, '')) || 0,
        description: r.description || null,
        category: r.category || null,
        track_stock: !!r.stock,
        stock: r.stock ? parseInt(r.stock) : null,
        is_active: true,
      }))
      await supabase.from('products').insert(batch)
      inserted += batch.length
      setProgress(Math.round((inserted / rows.length) * 100))
    }

    setDone(true)
    setImporting(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard/store')}
          className="p-2 rounded-[var(--r-md)] transition-colors duration-150"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Import Products</h1>
          <p className="text-[13px] text-[var(--text-3)] mt-0.5">Upload a CSV to add multiple products at once</p>
        </div>
      </div>

      {/* CSV format guide */}
      <div className="px-4 py-3 rounded-[var(--r-lg)]" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <FileText size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-[12px] font-semibold" style={{ color: 'var(--accent)' }}>Required CSV format</span>
        </div>
        <code className="text-[11px] text-[var(--text-2)]">Name, Price, Description, Category, Stock</code>
        <br />
        <code className="text-[11px] text-[var(--text-3)]">Blue Dress, 45000, Beautiful evening dress, Boutique, 10</code>
      </div>

      {/* Drop zone */}
      {!done && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 py-16 rounded-[var(--r-xl)] cursor-pointer transition-all duration-200"
          style={{
            background: dragging ? 'var(--accent-dim)' : 'var(--surface-2)',
            border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          }}
        >
          <Upload size={32} style={{ color: dragging ? 'var(--accent)' : 'var(--text-3)' }} />
          <div className="text-center">
            <div className="text-[14px] font-semibold text-[var(--text-1)]">
              {filename ? filename : 'Drop your CSV here'}
            </div>
            <div className="text-[12px] text-[var(--text-3)] mt-1">or click to browse</div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-[var(--r-lg)]" style={{ background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--error)' }}>
          <AlertCircle size={14} />
          <span className="text-[13px]">{error}</span>
        </div>
      )}

      {/* Preview */}
      {rows.length > 0 && !done && (
        <div className="rounded-[var(--r-xl)] overflow-hidden" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[13px] font-semibold text-[var(--text-1)]">Preview — {rows.length} products found</span>
            <span className="text-[12px] text-[var(--text-3)]">Showing first 10</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Price', 'Category', 'Stock'].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-semibold" style={{ color: 'var(--text-3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 10).map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-4 py-2 text-[var(--text-1)]">{r.name}</td>
                    <td className="px-4 py-2 text-[var(--text-2)]">{r.price}</td>
                    <td className="px-4 py-2 text-[var(--text-3)]">{r.category || '—'}</td>
                    <td className="px-4 py-2 text-[var(--text-3)]">{r.stock || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import progress */}
      {importing && (
        <div className="space-y-2">
          <div className="flex justify-between text-[12px]">
            <span style={{ color: 'var(--text-3)' }}>Importing...</span>
            <span style={{ color: 'var(--accent)' }}>{progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>
      )}

      {/* Success */}
      {done && (
        <div className="flex flex-col items-center gap-4 py-12">
          <CheckCircle2 size={48} style={{ color: 'var(--success)' }} />
          <div className="text-[18px] font-semibold text-[var(--text-1)]">{rows.length} products imported!</div>
          <button
            onClick={() => router.push('/dashboard/store')}
            className="px-6 py-2.5 rounded-[var(--r-md)] text-[14px] font-semibold"
            style={{ background: 'var(--accent)', color: 'var(--void)' }}
          >
            View Store
          </button>
        </div>
      )}

      {rows.length > 0 && !done && !importing && (
        <button
          onClick={runImport}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--r-lg)] text-[14px] font-semibold transition-all duration-150"
          style={{ background: 'var(--accent)', color: 'var(--void)' }}
          onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
          onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
        >
          <Upload size={16} /> Import {rows.length} Products
        </button>
      )}
    </div>
  )
}
