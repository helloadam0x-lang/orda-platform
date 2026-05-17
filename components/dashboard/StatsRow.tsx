'use client'

import { motion, type Variants } from 'framer-motion'
import { MessageSquare, Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface Props {
  conversationsCount: number
  contactsCount: number
  ordersCount: number
  totalRevenue: number
}

const CARDS = (p: Props) => [
  {
    label: 'Total Conversations',
    value: formatNumber(p.conversationsCount),
    icon: MessageSquare,
    trend: '+12% this week',
    trendUp: true,
  },
  {
    label: 'Total Contacts',
    value: formatNumber(p.contactsCount),
    icon: Users,
    trend: '+8% this week',
    trendUp: true,
  },
  {
    label: 'Total Orders',
    value: formatNumber(p.ordersCount),
    icon: ShoppingBag,
    trend: '+5% this week',
    trendUp: true,
  },
  {
    label: 'Total Revenue',
    value: formatCurrency(p.totalRevenue),
    icon: DollarSign,
    trend: '+18% this week',
    trendUp: true,
  },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function StatsRow(props: Props) {
  const cards = CARDS(props)
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.label}
            variants={item}
            className="bg-orda-surface border border-orda-border rounded-[14px] p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-orda-accent/10 flex items-center justify-center">
                <Icon size={18} className="text-orda-accent" />
              </div>
            </div>
            <p className="text-orda-light font-bold font-space-grotesk text-3xl leading-none mb-1">
              {card.value}
            </p>
            <p className="text-orda-grey text-[13px] mb-3">{card.label}</p>
            {card.trend && (
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className="text-orda-success" />
                <span className="text-orda-success text-[12px] font-medium">{card.trend}</span>
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
