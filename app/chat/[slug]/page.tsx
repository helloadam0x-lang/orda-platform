import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatInterface from '@/components/chat/ChatInterface'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('businesses')
    .select('name, description')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Chat' }
  return {
    title: `Chat with ${data.name}`,
    description: data.description ?? `Chat with ${data.name} on Orda`,
  }
}

export default async function ChatPage({ params }: Props) {
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, greeting, chat_accent')
    .eq('slug', params.slug)
    .single()

  if (!business) notFound()

  return (
    <ChatInterface
      businessId={business.id}
      businessName={business.name}
      greeting={(business.greeting as string | null) ?? 'Hello! How can I help you today?'}
      accentColor={(business.chat_accent as string | null) ?? '#8729A0'}
    />
  )
}
