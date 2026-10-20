import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";

export const Route = createFileRoute("/rewards")({ component: RewardsPage });

const earn = [
  ["Your first shop", "5 points"],
  ["Each shop after your first", "3 points"],
  ["Share a story wearing Selah", "5 points"],
  ["Share a story wearing Selah while evangelising", "10 points"],
  ["Birthday gift", "5 points + a free face mask + a discount"],
];

function RewardsPage() {
  return <StoreLayout><main className="container-page min-h-[70vh] py-20 md:py-28">
    <header className="cloud-accent mx-auto max-w-3xl rounded-[2rem] px-6 py-12 text-center md:px-12 md:py-16">
      <p className="eyebrow">The society</p><h1 className="mt-3 font-display text-5xl md:text-7xl">Selah rewards</h1>
      <p className="mx-auto mt-5 max-w-xl text-muted-foreground">A little thank-you for shopping, sharing your faith, and being part of our community.</p>
    </header>
    <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2">
      <section className="rounded-3xl border border-border bg-card/70 p-7 md:p-9"><h2 className="font-display text-2xl">Earn points</h2><ul className="mt-6 divide-y divide-border">{earn.map(([action, points]) => <li key={action} className="flex justify-between gap-5 py-4 text-sm"><span>{action}</span><strong className="text-right">{points}</strong></li>)}</ul></section>
      <section className="rounded-3xl border border-border bg-card/70 p-7 md:p-9"><h2 className="font-display text-2xl">Spend points</h2><div className="mt-6 space-y-4 text-sm"><p className="flex justify-between border-b border-border pb-4"><span>Free face mask</span><strong>7 points</strong></p><p className="flex justify-between border-b border-border pb-4"><span>Spa break</span><strong>15 points</strong></p></div><p className="mt-6 text-sm leading-6 text-muted-foreground">Points are used when you redeem a reward and have no cash value. The proposed verification, expiry, and fair-use rules are being finalised; rewards are not yet redeemable online.</p><p className="mt-4 text-xs leading-5 text-muted-foreground">Birthday gifts require a date of birth on your account. Reward availability and terms will be confirmed before launch.</p><Link to="/account" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Visit your account</Link></section>
    </div>
  </main></StoreLayout>;
}
