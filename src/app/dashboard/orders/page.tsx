'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderStats } from '@/types/orders';
import { playOrderSound } from '@/lib/sounds';
import OrderStatsRow from '@/components/dashboard/orders/OrderStatsRow';
import OrderFilterBar from '@/components/dashboard/orders/OrderFilterBar';
import OrderList from '@/components/dashboard/orders/OrderList';
import OrderDetailPanel from '@/components/dashboard/orders/OrderDetailPanel';

export default function OrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Fetch the authenticated user's business ID on mount
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/sign-in'); return; }

      const { data: biz } = await supabase
        .from('businesses').select('id, currency').eq('user_id', user.id).single();

      if (!biz) { router.push('/onboarding'); return; }
      setBusinessId(biz.id);
      if (biz.currency) setCurrency(biz.currency);
    };
    init();
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter.toLowerCase().replace(/ /g, '_'));
      if (paymentFilter !== 'All') params.append('payment', paymentFilter.toLowerCase());
      if (search) params.append('search', search);

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
      if (data.stats) setStats(data.stats);
    } finally {
      setLoading(false);
    }
  }, [businessId, statusFilter, paymentFilter, search]);

  useEffect(() => {
    const id = setTimeout(fetchOrders, 300);
    return () => clearTimeout(id);
  }, [fetchOrders]);

  // Realtime subscriptions
  useEffect(() => {
    if (!businessId) return;

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'orders',
        filter: `business_id=eq.${businessId}`,
      }, (payload) => {
        setOrders(prev => [payload.new as Order, ...prev]);
        setStats(prev => prev ? { ...prev, total_today: prev.total_today + 1 } : null);
        playOrderSound();
        setHighlightedOrderId(payload.new.id as string);
        setTimeout(() => setHighlightedOrderId(null), 2000);
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'orders',
        filter: `business_id=eq.${businessId}`,
      }, (payload) => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } as Order : o));
        setSelectedOrder(prev => prev?.id === payload.new.id ? { ...prev, ...payload.new } as Order : prev);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [businessId]);

  return (
    <div className="flex flex-col w-full h-full bg-[#050507] text-[#EFEFEF] overflow-hidden relative">
      <div className="p-6 shrink-0 z-10">
        <OrderStatsRow stats={stats} currency={currency} />
        <div className="mt-8">
          <OrderFilterBar
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            paymentFilter={paymentFilter} setPaymentFilter={setPaymentFilter}
            search={search} setSearch={setSearch}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className={`flex-1 overflow-y-auto px-6 pb-6 transition-all ease-emil duration-300 ${selectedOrder ? 'w-[55%] max-w-[55%]' : 'w-full'}`}>
          <OrderList
            orders={orders} loading={loading} currency={currency}
            selectedOrder={selectedOrder} onSelect={setSelectedOrder}
            highlightedOrderId={highlightedOrderId}
          />
        </div>

        <div className={`absolute top-0 right-0 h-full w-full md:w-[45%] bg-[#07070a] border-l border-white/5 transform transition-transform ease-emil duration-300 z-20 shadow-2xl ${selectedOrder ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedOrder && (
            <OrderDetailPanel
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              currency={currency}
            />
          )}
        </div>
      </div>
    </div>
  );
}
