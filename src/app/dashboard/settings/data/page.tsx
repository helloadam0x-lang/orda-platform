'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Download, Trash2, Shield, ArrowLeft } from 'lucide-react'

export default function DataSettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [confirmEmail, setConfirmEmail] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) { router.push('/sign-in'); return }
      setUser(u)
      supabase.from('businesses').select('id').eq('user_id', u.id).single()
        .then(({ data }) => { if (data) setBusiness(data) })
    })
  }, [])

  async function downloadData() {
    if (!user) return
    setDownloading(true)
    const { data } = await supabase.rpc('export_user_data', { p_user_id: user.id })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orda-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setDownloading(false)
  }

  async function deleteAccount() {
    if (!user || confirmEmail !== user.email) { setDeleteError('Email does not match.'); return }
    setDeleting(true)
    await supabase.from('data_deletion_requests').insert({ user_id: user.id, email: user.email, status: 'pending' })
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] text-[var(--text-3)] hover:text-[var(--text-1)]">
        <ArrowLeft size={14} /> Back to Settings
      </button>

      <div>
        <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Data & Privacy</h1>
        <p className="text-[13px] text-[var(--text-3)] mt-1">Manage your personal data and account</p>
      </div>

      {/* Download data */}
      <div className="rounded-[var(--r-xl)] p-5 space-y-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: 'var(--accent)' }} />
          <div className="text-[14px] font-semibold text-[var(--text-1)]">Download Your Data</div>
        </div>
        <p className="text-[13px] text-[var(--text-2)] leading-relaxed">
          Export all your business data — orders, contacts, messages, and more — as a JSON file.
        </p>
        <button
          onClick={downloadData}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150 disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'var(--void)' }}
          onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
          onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
        >
          <Download size={14} />
          {downloading ? 'Preparing…' : 'Download Data'}
        </button>
      </div>

      {/* Delete account */}
      <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2">
          <Trash2 size={16} style={{ color: 'var(--error)' }} />
          <div className="text-[14px] font-semibold" style={{ color: 'var(--error)' }}>Delete Account</div>
        </div>
        <p className="text-[13px] text-[var(--text-2)] leading-relaxed">
          This will permanently delete your account, business, all customers, orders, and messages. This cannot be undone.
        </p>
        <div>
          <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">
            Type your email to confirm: <span className="normal-case font-medium text-[var(--text-2)]">{user?.email}</span>
          </label>
          <input
            value={confirmEmail}
            onChange={e => { setConfirmEmail(e.target.value); setDeleteError('') }}
            placeholder={user?.email ?? 'your@email.com'}
            className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--void)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
            style={{ border: '1px solid rgba(239,68,68,0.3)' }}
          />
          {deleteError && <div className="text-[12px] mt-1.5" style={{ color: 'var(--error)' }}>{deleteError}</div>}
        </div>
        <button
          onClick={deleteAccount}
          disabled={deleting || !confirmEmail}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150 disabled:opacity-40"
          style={{ background: 'var(--error)', color: '#fff' }}
        >
          <Trash2 size={14} />
          {deleting ? 'Deleting…' : 'Delete My Account'}
        </button>
      </div>
    </div>
  )
}
