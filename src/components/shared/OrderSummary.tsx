import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/format";

export function OrderSummary({
  subtotal,
  discount = 0,
  shipping,
  total,
  actionLabel,
  actionTo,
  onAction,
}: {
  subtotal: number;
  discount?: number;
  shipping: number;
  total: number;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}) {
  return (
    <aside className="border border-[#E5E5E5] bg-white p-8">
      <h2 className="mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
        Order Summary
      </h2>
      <dl className="space-y-4 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-[#777777]">SUBTOTAL</dt>
          <dd className="font-medium text-[#1A1A1A]">{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[#FFC0CB]">
            <dt>DISCOUNT</dt>
            <dd>-{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-[#777777]">SHIPPING</dt>
          <dd className="font-medium text-[#1A1A1A]">{shipping ? formatPrice(shipping) : "FREE"}</dd>
        </div>
        <div className="mt-6 flex justify-between border-t border-[#E5E5E5] pt-6 text-[14px]">
          <dt className="font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">Total</dt>
          <dd className="font-bold text-[#1A1A1A]">{formatPrice(total)}</dd>
        </div>
      </dl>
      
      {actionLabel && (
        <div className="mt-8">
          {actionTo ? (
            <Link
              to={actionTo}
              className="flex h-14 w-full items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="flex h-14 w-full items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
