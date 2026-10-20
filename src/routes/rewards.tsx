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
      <p className="eyebrow">A little thank-you from Selah</p><h1 className="mt-3 font-display text-5xl md:text-7xl">Selah rewards</h1>
      <p className="mx-auto mt-5 max-w-xl text-muted-foreground">Earn points as you shop and share your Selah story. Your points unlock thoughtful gifts for our community.</p>
    </header>
    <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2">
      <section className="rounded-3xl border border-border bg-card/70 p-7 md:p-9"><p className="eyebrow">Be part of the story</p><h2 className="mt-2 font-display text-3xl">Earn points</h2><ul className="mt-6 divide-y divide-border">{earn.map(([action, points]) => <li key={action} className="flex justify-between gap-5 py-4 text-sm"><span>{action}</span><strong className="text-right">{points}</strong></li>)}</ul><p className="mt-5 text-xs leading-5 text-muted-foreground">Social story rewards will be reviewed before points are added. Birthday reward details are subject to final terms.</p></section>
      <section className="rounded-3xl border border-border bg-card/70 p-7 md:p-9"><p className="eyebrow">Little moments of delight</p><h2 className="mt-2 font-display text-3xl">Choose a reward</h2><div className="mt-6 space-y-4 text-sm"><p className="flex justify-between border-b border-border pb-4"><span>Free face mask</span><strong>7 points</strong></p><p className="flex justify-between border-b border-border pb-4"><span>Spa break</span><strong>15 points</strong></p></div><p className="mt-6 text-sm leading-6 text-muted-foreground">Points have no cash value. The rules for verification, expiry, and redemption are being finalised, so rewards cannot yet be redeemed online.</p><Link to="/account" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Visit your account</Link></section>
    </div>
  </main></StoreLayout>;
}
