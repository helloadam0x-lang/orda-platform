import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessTypeLabel } from '@/lib/businessTypes'

const GEMINI_KEY = process.env.GEMINI_API_KEY!

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessId } = await request.json()
  const { data: biz } = await supabase.from('businesses').select('*').eq('id', businessId).eq('user_id', user.id).single()
  if (!biz) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: products } = await supabase.from('products').select('name, price, description').eq('business_id', businessId).eq('is_active', true).limit(10)
  const productList = (products ?? []).map((p: any) => `${p.name} (${biz.currency} ${p.price})`).join(', ')

  const prompt = `You are a professional copywriter. Write website content for this business:

Business: ${biz.name}
Type: ${getBusinessTypeLabel(biz.business_type)}
City: ${biz.city ?? 'Africa'}
Tagline: ${biz.tagline ?? ''}
Description: ${biz.description ?? ''}
Products: ${productList || 'Various products and services'}

Generate ONLY a valid JSON object (no markdown, no extra text) with these fields:
{
  "hero_headline": "A compelling 5-8 word headline",
  "hero_subtext": "A compelling 1-2 sentence value proposition",
  "about_text": "2-3 sentences about the business",
  "features": [
    {"icon": "emoji", "title": "Feature title", "description": "1 sentence"},
    {"icon": "emoji", "title": "Feature title", "description": "1 sentence"},
    {"icon": "emoji", "title": "Feature title", "description": "1 sentence"}
  ],
  "faq": [
    {"question": "Common question", "answer": "Clear answer"},
    {"question": "Common question", "answer": "Clear answer"},
    {"question": "Common question", "answer": "Clear answer"}
  ],
  "seo_title": "Business Name — Short tagline (max 60 chars)",
  "seo_description": "Meta description (max 160 chars)"
}`

  let content: any = {}
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.7 },
        }),
      }
    )
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    content = JSON.parse(clean)
  } catch (e) {
    content = {
      hero_headline: `Welcome to ${biz.name}`,
      hero_subtext: biz.tagline ?? 'Quality products and services.',
      about_text: biz.description ?? `${biz.name} is a ${getBusinessTypeLabel(biz.business_type)} based in ${biz.city ?? 'Africa'}.`,
      features: [],
      faq: [],
      seo_title: `${biz.name} — ${getBusinessTypeLabel(biz.business_type)}`,
      seo_description: biz.tagline ?? '',
    }
  }

  const config = {
    business_id: businessId,
    theme: 'luxe',
    published: true,
    sections_enabled: { products: true, about: true, features: true, gallery: false, reviews: true, faq: true, contact: true },
    ...content,
  }

  const { data: saved } = await supabase.from('website_config').upsert(config, { onConflict: 'business_id' }).select().single()

  return NextResponse.json({ config: saved })
}
