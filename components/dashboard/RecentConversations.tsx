'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getInitials, timeAgo, platformColor } from '@/lib/utils'
import type { Conversation } from '@/types/database'

interface Props {
  conversations: Conversation[]
}

export default function RecentConversations({ conversations }: Props) {
  const router = useRouter()

  return (
    <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-orda-light font-bold font-space-grotesk text-base">Recent Conversations</h2>
        <Link
          href="/dashboard/conversations"
          className="text-orda-accent text-xs font-medium hover:underline"
        >
          View all
        </Link>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-orda-grey text-sm">
          <p>No conversations yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => {
            const name = conv.contact?.name ?? 'Unknown'
            const platform = conv.contact?.platform ?? conv.platform
            const color = platformColor(platform)
            return (
              <div
                key={conv.id}
                onClick={() => router.push(`/dashboard/conversations?id=${conv.id}`)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors group"
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${color}99, ${color}55)` }}
                >
                  {getInitials(name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-orda-light text-[13px] font-semibold truncate">{name}</span>
                    <span className="text-orda-grey text-[11px] flex-shrink-0">
                      {timeAgo(conv.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-orda-grey text-[12px] truncate">
                      {conv.last_message ?? 'No messages yet'}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                        style={{ background: `${color}20`, color }}
                      >
                        {platform}
                      </span>
                      {conv.unread_count > 0 && (
                        <span className="w-4 h-4 rounded-full bg-orda-accent flex items-center justify-center text-[9px] text-white font-bold">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
