'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Globe, Wand2, Eye, EyeOff, ExternalLink, Check } from 'lucide-react'
import { WEBSITE_THEMES } from '@/lib/websiteThemes'

const SECTIONS = [
  { key: 'products', label: 'Products' },
  { key: 'about', label: 'About' },
  { key: 'features', label: 'Features' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'faq', label: 'FAQ' },
  { key: 'contact', label: 'Contact' },
]

export default function WebsitePage() {
  const router = useRouter()
  const supabase = createClient()
  const [business, setBusiness] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatingStatus, setGeneratingStatus] = useState('')
  const [tab, setTab] = useState<'design' | 'content' | 'seo'>('design')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id, name, slug, business_type').eq('user_id', user.id).single()
        .then(async ({ data: biz }) => {
          if (!biz) { router.push('/onboarding'); return }
          setBusiness(biz)
          const { data: wc } = await supabase.from('website_config').select('*').eq('business_id', biz.id).single()
          setConfig(wc)
          setLoading(false)
        })
    })
  }, [])

  async function generateWebsite() {
    if (!business) return
    setGenerating(true)
    setGeneratingStatus('Writing your content…')
    try {
      const res = await fetch('/api/website/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessId: business.id }) })
      const data = await res.json()
      setConfig(data.config)
      setGeneratingStatus('Done!')
    } catch {
      setGeneratingStatus('Error. Please try again.')
    }
    setGenerating(false)
  }

  async function togglePublished() {
    if (!config || !business) return
    const next = !config.published
    await supabase.from('website_config').update({ published: next }).eq('business_id', business.id)
    setConfig((c: any) => ({ ...c, published: next }))
  }

  async function updateConfig(patch: Record<string, any>) {
    if (!business) return
    setSaving(true)
    const next = { ...config, ...patch }
    setConfig(next)
    await supabase.from('website_config').upsert({ business_id: business.id, ...next })
    setSaving(false)
  }

  const siteUrl = business ? `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://getorda.app'}/${business.slug}` : ''

  if (loading) return (
    <div className="p-6 space-y-4">
      <div className="h-12 w-48 skeleton rounded" />
      <div className="h-64 skeleton rounded-[var(--r-xl)]" />
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">My Website</h1>
          <p className="text-[13px] text-[var(--text-3)] mt-1">AI-generated website for your business</p>
        </div>
        {config && (
          <div className="flex items-center gap-2">
            <a href={siteUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-[var(--r-md)] text-[12px] font-medium transition-colors duration-150"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
            >
              <ExternalLink size={13} /> View
            </a>
            <button
              onClick={togglePublished}
              className="flex items-center gap-1.5 px-3 py-2 rounded-[var(--r-md)] text-[12px] font-semibold transition-all duration-150"
              style={{
                background: config?.published ? 'var(--success-dim)' : 'var(--accent-dim)',
                border: `1px solid ${config?.published ? 'rgba(34,197,94,0.3)' : 'var(--accent-border)'}`,
                color: config?.published ? 'var(--success)' : 'var(--accent)',
              }}
            >
              {config?.published ? <><Eye size={13} /> Published</> : <><EyeOff size={13} /> Unpublished</>}
            </button>
          </div>
        )}
      </div>

      {!config ? (
        /* No website yet */
        <div className="rounded-[var(--r-2xl)] p-10 text-center space-y-6" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            <Globe size={28} />
          </div>
          <div>
            <h2 className="font-['Playfair_Display'] font-black text-xl text-[var(--text-1)]">Your website is ready to launch</h2>
            <p className="text-[13px] text-[var(--text-2)] mt-2 max-w-md mx-auto">Our AI will write all your content — headlines, descriptions, FAQs — in seconds.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            {WEBSITE_THEMES.map(theme => (
              <div
                key={theme.id}
                className="p-3 rounded-[var(--r-lg)] text-left cursor-pointer transition-all duration-150 hover:scale-[1.02]"
                style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
                onClick={() => updateConfig({ theme: theme.id })}
              >
                <div className="text-[13px] font-semibold text-[var(--text-1)]">{theme.name}</div>
                <div className="text-[11px] text-[var(--text-3)] mt-0.5">{theme.description}</div>
              </div>
            ))}
          </div>

          <button
            onClick={generateWebsite}
            disabled={generating}
            className="flex items-center justify-center gap-2 mx-auto px-8 py-3 rounded-[var(--r-lg)] text-[14px] font-semibold transition-all duration-150 disabled:opacity-60"
            style={{ background: 'var(--accent)', color: 'var(--void)' }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            <Wand2 size={16} />
            {generating ? generatingStatus : 'Generate My Website'}
          </button>
        </div>
      ) : (
        /* Editor */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Editor panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-1 p-1 rounded-[var(--r-md)]" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              {(['design', 'content', 'seo'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-1.5 rounded-[var(--r-sm)] text-[12px] font-medium capitalize transition-colors duration-150"
                  style={{ background: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? 'var(--void)' : 'var(--text-2)' }}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 'design' && (
              <div className="space-y-4 rounded-[var(--r-xl)] p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-2">Theme</div>
                  <div className="grid grid-cols-2 gap-2">
                    {WEBSITE_THEMES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => updateConfig({ theme: t.id })}
                        className="py-2 px-3 rounded-[var(--r-md)] text-left text-[12px] transition-all duration-150"
                        style={{
                          background: config?.theme === t.id ? 'var(--accent-dim)' : 'var(--surface-3)',
                          border: `1px solid ${config?.theme === t.id ? 'var(--accent-border)' : 'var(--border)'}`,
                          color: config?.theme === t.id ? 'var(--accent)' : 'var(--text-2)',
                        }}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-2">Sections</div>
                  <div className="space-y-2">
                    {SECTIONS.map(s => (
                      <label key={s.key} className="flex items-center justify-between cursor-pointer">
                        <span className="text-[13px] text-[var(--text-1)]">{s.label}</span>
                        <button
                          onClick={() => updateConfig({
                            sections_enabled: { ...(config?.sections_enabled ?? {}), [s.key]: !config?.sections_enabled?.[s.key] }
                          })}
                          className="w-9 h-5 rounded-full relative transition-colors duration-200"
                          style={{ background: config?.sections_enabled?.[s.key] !== false ? 'var(--accent)' : 'var(--surface-3)' }}
                        >
                          <span
                            className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                            style={{ transform: config?.sections_enabled?.[s.key] !== false ? 'translateX(20px)' : 'translateX(2px)' }}
                          />
                        </button>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'content' && (
              <div className="space-y-4 rounded-[var(--r-xl)] p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                {[
                  { key: 'hero_headline', label: 'Hero Headline', type: 'input' },
                  { key: 'hero_subtext', label: 'Hero Subtext', type: 'textarea' },
                  { key: 'about_text', label: 'About', type: 'textarea' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">{field.label}</label>
                    {field.type === 'input' ? (
                      <input
                        defaultValue={config?.[field.key] ?? ''}
                        onBlur={e => updateConfig({ [field.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none"
                        style={{ border: '1px solid var(--border)' }}
                      />
                    ) : (
                      <textarea
                        defaultValue={config?.[field.key] ?? ''}
                        onBlur={e => updateConfig({ [field.key]: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none resize-none"
                        style={{ border: '1px solid var(--border)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === 'seo' && (
              <div className="space-y-4 rounded-[var(--r-xl)] p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                {[
                  { key: 'seo_title', label: 'SEO Title', max: 60 },
                  { key: 'seo_description', label: 'SEO Description', max: 160 },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">{field.label}</label>
                    <input
                      defaultValue={config?.[field.key] ?? ''}
                      maxLength={field.max}
                      onBlur={e => updateConfig({ [field.key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none"
                      style={{ border: '1px solid var(--border)' }}
                    />
                  </div>
                ))}
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5">Website URL</div>
                  <div
                    className="px-3 py-2 rounded-[var(--r-md)] text-[13px] break-all"
                    style={{ background: 'var(--surface-3)', color: 'var(--accent)', border: '1px solid var(--border)' }}
                  >
                    {siteUrl}
                  </div>
                </div>
              </div>
            )}

            {saving && <div className="text-[12px] text-[var(--text-3)] flex items-center gap-1"><Check size={12} style={{ color: 'var(--success)' }} /> Saved</div>}
          </div>

          {/* Preview iframe */}
          <div className="lg:col-span-3 rounded-[var(--r-xl)] overflow-hidden" style={{ border: '1px solid var(--border)', minHeight: 500 }}>
            {config?.published ? (
              <iframe src={siteUrl} className="w-full h-full min-h-[500px]" title="Website preview" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-[var(--text-3)]">
                <Globe size={32} className="mb-3 opacity-30" />
                <div className="text-[13px]">Publish to preview live</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
