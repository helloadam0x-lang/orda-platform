import { Order } from '@/types/orders';
import OrderCard from './OrderCard';
import { ShoppingBag } from 'lucide-react';

interface Props {
  orders: Order[];
  loading: boolean;
  currency: string;
  selectedOrder: Order | null;
  onSelect: (order: Order | null) => void;
  highlightedOrderId: string | null;
}

export default function OrderList({ orders, loading, currency, selectedOrder, onSelect, highlightedOrderId }: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-white/[0.02] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-white/20">
        <ShoppingBag size={40} className="mb-4" />
        <p className="text-[15px] font-medium">No orders yet</p>
        <p className="text-[13px] mt-1">Orders placed via WhatsApp will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map(order => (
        <OrderCard
          key={order.id}
          order={order}
          currency={currency}
          isSelected={selectedOrder?.id === order.id}
          isHighlighted={highlightedOrderId === order.id}
          onClick={() => onSelect(selectedOrder?.id === order.id ? null : order)}
        />
      ))}
    </div>
  );
}
