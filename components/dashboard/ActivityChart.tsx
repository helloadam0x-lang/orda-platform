'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DayActivity } from '@/types/database'

interface Props {
  data: DayActivity[]
}

export default function ActivityChart({ data }: Props) {
  return (
    <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6 h-full">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-orda-light font-bold font-space-grotesk text-base">Message Activity</h2>
      </div>
      <p className="text-orda-grey text-[12px] mb-5">Last 7 days</p>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8729A0" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8729A0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2400" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#8892A4"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#8892A4"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0A1200',
              border: '1px solid #1a2400',
              borderRadius: 8,
              color: '#E4F0F6',
              fontSize: 12,
            }}
            cursor={{ stroke: '#8729A040' }}
          />
          <Area
            type="monotone"
            dataKey="messages"
            stroke="#8729A0"
            strokeWidth={2}
            fill="url(#colorMsg)"
            dot={false}
            activeDot={{ r: 4, fill: '#8729A0', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
