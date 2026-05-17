'use client'

import Link from 'next/link'
import { formatCurrency, timeAgo, statusColor } from '@/lib/utils'
import type { Order } from '@/types/database'

interface Props {
  orders: Order[]
}

export default function RecentOrders({ orders }: Props) {
  return (
    <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-orda-light font-bold font-space-grotesk text-base">Recent Orders</h2>
        <Link href="/dashboard/orders" className="text-orda-accent text-xs font-medium hover:underline">
          View all
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-orda-grey text-sm">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-1">
          {orders.map((order) => {
            const color = statusColor(order.status)
            return (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 px-3 py-3 rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-orda-grey text-[11px] font-mono">#{order.order_number}</span>
                    <span className="text-orda-light text-[13px] font-medium truncate">
                      {order.contact?.name ?? 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-orda-light text-[13px] font-semibold">
                    {formatCurrency(order.amount)}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                    style={{ background: `${color}20`, color }}
                  >
                    {order.status}
                  </span>
                  <span className="text-orda-grey text-[11px] hidden sm:inline">
                    {timeAgo(order.created_at)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
