import { OrderStats } from '@/types/orders';
import { formatCurrency } from '@/lib/format';
import { ShoppingBag, TrendingUp, CreditCard, Truck } from 'lucide-react';

interface Props {
  stats: OrderStats | null;
  currency: string;
}

export default function OrderStatsRow({ stats, currency }: Props) {
  const cards = [
    { label: "Today's Orders",   value: stats?.total_today ?? '—',                                      icon: ShoppingBag, color: '#D4A853' },
    { label: "Today's Revenue",  value: stats ? formatCurrency(stats.revenue_today, currency) : '—',   icon: TrendingUp,  color: '#25D366' },
    { label: "Awaiting Payment", value: stats?.pending_payment ?? '—',                                  icon: CreditCard,  color: '#f59e0b' },
    { label: "Out for Delivery", value: stats?.pending_delivery ?? '—',                                 icon: Truck,       color: '#60a5fa' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <card.icon size={14} style={{ color: card.color }} />
            <span className="text-[11px] uppercase tracking-widest text-white/30 font-bold">{card.label}</span>
          </div>
          <p className={`font-playfair font-bold text-[28px] tracking-tight ${stats ? 'text-[#EFEFEF]' : 'text-white/20'}`}>
            {stats ? card.value : '—'}
          </p>
        </div>
      ))}
    </div>
  );
}
