'use client';

import { useState } from 'react';
import { Order, STATUS_COLORS, STATUS_LABELS } from '@/types/orders';
import { formatCurrency, formatOrderTime, getAvatarGradient } from '@/lib/format';
import { X, MessageSquare, CheckCircle, Truck, Package, Clock } from 'lucide-react';

interface Props {
  order: Order;
  currency: string;
  onClose: () => void;
}

export default function OrderDetailPanel({ order, currency, onClose }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifyCustomer, setNotifyCustomer] = useState(true);

  const updateStatus = async (status: string, additionalParams = {}) => {
    setIsUpdating(true);
    await fetch(`/api/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        sendWhatsApp: notifyCustomer,
        customerPhone: order.contact_phone,
        customerName: order.contact_name,
        ...additionalParams,
      }),
    });
    setIsUpdating(false);
  };

  const timeline = [
    { step: 'Order Placed',    time: order.created_at,   icon: Clock,        done: !!order.created_at },
    { step: 'Confirmed',       time: order.confirmed_at,  icon: CheckCircle,  done: !!order.confirmed_at },
    { step: 'Packed',          time: order.packed_at,     icon: Package,      done: !!order.packed_at },
    { step: 'Out for Delivery',time: order.dispatched_at, icon: Truck,        done: !!order.dispatched_at },
    { step: 'Delivered',       time: order.delivered_at,  icon: CheckCircle,  done: !!order.delivered_at },
  ];

  return (
    <div className="flex flex-col h-full bg-[#07070a] overflow-hidden">
      {/* HEADER */}
      <div className="sticky top-0 shrink-0 bg-[#07070a]/80 backdrop-blur-md border-b border-white/5 p-6 flex justify-between items-center z-10">
        <div>
          <h2 className="font-playfair font-bold text-2xl text-[#D4A853]">{order.order_number}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: STATUS_COLORS[order.status].bg, color: STATUS_COLORS[order.status].text }}>
              {STATUS_LABELS[order.status]}
            </span>
            <span className="text-[12px] text-white/40">{formatOrderTime(order.created_at)}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors ease-emil active:scale-[0.97]">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {/* CUSTOMER */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-inner" style={{ background: getAvatarGradient(order.contact_name) }}>
                {order.contact_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#EFEFEF]">{order.contact_name}</h3>
                <p className="text-[13px] text-white/40 mt-0.5">{order.contact_phone}</p>
              </div>
            </div>
            <div className="text-right text-[12px] text-white/40">{order.contact_total_orders} previous orders</div>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[13px] font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ease-emil active:scale-[0.97]">
              <MessageSquare size={14} /> Message Customer
            </button>
            <a href={`https://wa.me/${order.contact_phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-[13px] font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ease-emil active:scale-[0.97]">
              WhatsApp
            </a>
          </div>
        </div>

        {/* ITEMS */}
        <div>
          <h4 className="text-[11px] uppercase tracking-widest text-white/30 font-bold mb-4">Items Ordered</h4>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
                    <Package size={16} className="text-white/20" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#EFEFEF]">{item.name}</p>
                    <p className="text-[13px] text-[#D4A853] mt-0.5">× {item.qty}</p>
                  </div>
                </div>
                <p className="text-[14px] font-semibold">{formatCurrency(item.price * item.qty, currency)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2">
            <div className="flex justify-between text-[13px] text-white/40"><span className="uppercase">Subtotal</span><span>{formatCurrency(order.total, currency)}</span></div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Total</span>
              <span className="font-playfair font-bold text-2xl text-[#EFEFEF]">{formatCurrency(order.total, currency)}</span>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div>
          <h4 className="text-[11px] uppercase tracking-widest text-white/30 font-bold mb-4">Timeline</h4>
          <div className="relative pl-3 space-y-6 before:absolute before:inset-y-0 before:left-[15px] before:w-px before:bg-white/10">
            {timeline.map((s, i) => (
              <div key={i} className="relative flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full z-10 ${s.done ? 'bg-[#D4A853]' : 'bg-white/20'} ${order.status === s.step.toLowerCase().replace(/ /g, '_') ? 'ring-4 ring-[#D4A853]/20' : ''}`} />
                <div>
                  <p className={`text-[13px] font-semibold ${s.done ? 'text-white' : 'text-white/30'}`}>{s.step}</p>
                  {s.time && <p className="text-[11px] text-white/40">{formatOrderTime(s.time)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS FOOTER */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#07070a] via-[#07070a] to-transparent">
        {order.status === 'pending' && (
          <button onClick={() => updateStatus('confirmed')} disabled={isUpdating}
            className="w-full bg-[#D4A853] text-[#050507] font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(212,168,83,0.3)] hover:shadow-[0_0_30px_rgba(212,168,83,0.5)] transition-all ease-emil active:scale-[0.97]">
            Confirm Order
          </button>
        )}
        {order.status === 'confirmed' && (
          <button onClick={() => updateStatus('packed')} disabled={isUpdating}
            className="w-full bg-[#D4A853] text-[#050507] font-bold py-3.5 rounded-xl transition-transform ease-emil active:scale-[0.97]">
            Mark as Packed
          </button>
        )}
        {order.status === 'packed' && (
          <button onClick={() => updateStatus('out_for_delivery', { deliveryStatus: 'out_for_delivery' })} disabled={isUpdating}
            className="w-full bg-[#D4A853] text-[#050507] font-bold py-3.5 rounded-xl transition-transform ease-emil active:scale-[0.97]">
            Mark as Out for Delivery
          </button>
        )}
        {order.status === 'out_for_delivery' && (
          <button onClick={() => updateStatus('delivered', { deliveryStatus: 'delivered', paymentStatus: 'paid' })} disabled={isUpdating}
            className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-transform ease-emil active:scale-[0.97]">
            Mark as Delivered ✓
          </button>
        )}
        <div className="mt-4 flex items-center justify-center gap-2">
          <input type="checkbox" id="notify" checked={notifyCustomer} onChange={(e) => setNotifyCustomer(e.target.checked)} className="accent-[#D4A853]" />
          <label htmlFor="notify" className="text-[12px] text-white/50">Notify customer via WhatsApp</label>
        </div>
      </div>
    </div>
  );
}
