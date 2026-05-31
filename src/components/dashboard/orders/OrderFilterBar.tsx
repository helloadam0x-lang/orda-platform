import { Search } from 'lucide-react';

const STATUS_OPTS  = ['All', 'Pending', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];
const PAYMENT_OPTS = ['All', 'Unpaid', 'Paid'];

interface Props {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  paymentFilter: string;
  setPaymentFilter: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
}

export default function OrderFilterBar({ statusFilter, setStatusFilter, paymentFilter, setPaymentFilter, search, setSearch }: Props) {
  const pill = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${
      active
        ? 'bg-[#D4A853]/15 text-[#D4A853] border border-[#D4A853]/30'
        : 'bg-white/[0.03] text-white/40 border border-white/[0.05] hover:text-white'
    }`;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search orders, customers..."
          className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[#EFEFEF] outline-none focus:border-[#D4A853]/40 transition-colors duration-150 placeholder:text-white/25"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTS.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={pill(statusFilter === s)}>{s}</button>
        ))}
      </div>
      <div className="flex gap-2">
        {PAYMENT_OPTS.map(p => (
          <button key={p} onClick={() => setPaymentFilter(p)} className={pill(paymentFilter === p)}>{p}</button>
        ))}
      </div>
    </div>
  );
}
