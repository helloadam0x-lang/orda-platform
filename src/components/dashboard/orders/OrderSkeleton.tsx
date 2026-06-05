export function OrderSkeleton() {
  return (
    <div
      className="rounded-[var(--r-lg)] p-4 flex gap-4 items-center"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', marginBottom: 8 }}
    >
      <div className="w-10 h-10 rounded-full skeleton shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 skeleton rounded" />
        <div className="h-3 w-48 skeleton rounded" />
      </div>
      <div className="text-right space-y-2">
        <div className="h-4 w-20 skeleton rounded" />
        <div className="h-3 w-14 skeleton rounded ml-auto" />
      </div>
    </div>
  )
}

export function OrderSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => <OrderSkeleton key={i} />)}
    </>
  )
}
