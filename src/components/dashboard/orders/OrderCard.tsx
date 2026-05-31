import { Order, STATUS_COLORS, STATUS_LABELS } from '@/types/orders';
import { formatCurrency, timeAgo, getAvatarGradient } from '@/lib/format';
import { ChevronRight, Crown, Phone } from 'lucide-react';

interface Props {
  order: Order;
  currency: string;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
}

export default function OrderCard({ order, currency, isSelected, isHighlighted, onClick }: Props) {
  const statusColor = STATUS_COLORS[order.status];
  const paymentColor = STATUS_COLORS[order.payment_status === 'paid' ? 'delivered' : 'cancelled'];
  const avatarStyle = { background: getAvatarGradient(order.contact_name || '?') };

  return (
    <div
      onClick={onClick}
      className={`group flex items-center p-4 md:px-5 md:py-4 mb-2 rounded-xl border cursor-pointer transition-colors ease-emil duration-200 active:scale-[0.97]
      ${isSelected
        ? 'bg-[#D4A853]/5 border-[#D4A853]/25 border-l-4 border-l-[#D4A853]'
        : 'bg-white/2 border-white/5 hover:bg-white/5'}
      ${isHighlighted ? 'animate-highlight' : ''}`}
    >
      <div className="flex-[2] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-inner" style={avatarStyle}>
          {(order.contact_name || '?').charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#EFEFEF] truncate max-w-[150px]">{order.contact_name}</span>
            {order.contact_is_vip && (
              <div className="flex items-center gap-1 text-[#D4A853] bg-[#D4A853]/10 px-1.5 rounded-sm">
                <Crown size={10} /><span className="text-[10px] font-bold">VIP</span>
              </div>
            )}
          </div>
          <span className="text-[12px] text-white/40 flex items-center gap-1 mt-0.5">
            <Phone size={10} /> {order.contact_phone}
          </span>
        </div>
      </div>

      <div className="flex-[2] flex flex-col">
        <span className="text-[13px] font-semibold text-[#D4A853]">{order.order_number}</span>
        <span className="text-[12px] text-white/40 truncate mt-0.5">
          {order.items[0]?.name} {order.items.length > 1 ? `+ ${order.items.length - 1} more` : ''}
        </span>
        <span className="text-[11px] text-white/30 mt-1">{timeAgo(order.created_at)}</span>
      </div>

      <div className="flex-[1] flex flex-col">
        <div className="font-playfair font-bold text-[18px] tracking-tight">
          <span className="text-[11px] text-white/30 mr-1 font-sans">{currency}</span>
          {order.total.toLocaleString()}
        </div>
        <span className="text-[11px] text-white/40">{order.items.reduce((acc, curr) => acc + curr.qty, 0)} items</span>
      </div>

      <div className="flex-[2] flex flex-col gap-1.5 items-start">
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {STATUS_LABELS[order.status]}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: paymentColor.bg, color: paymentColor.text }}>
          {order.payment_status}
        </span>
      </div>

      <div className="flex-[1] flex justify-end">
        <ChevronRight size={18} className={`text-white/30 transition-transform ease-emil duration-300 ${isSelected ? 'rotate-90 text-[#D4A853]' : 'group-hover:translate-x-1'}`} />
      </div>
    </div>
  );
}
