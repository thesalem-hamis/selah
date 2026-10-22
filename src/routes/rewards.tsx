import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { useAuth } from "@/context/AuthContext";
import { MAX_INSTAGRAM_SCREENSHOT_BYTES, rewardService } from "@/services/rewardService";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/rewards")({ component: RewardsPage });

const earningRules = [
  ["Your first completed purchase", "5 points"],
  ["Every later completed purchase", "3 points"],
  ["Approved Instagram post wearing Selah", "5 points"],
  ["Approved post wearing Selah while preaching or evangelising", "10 points"],
  ["Your birthday", "5 points and a free face mask"],
];

function RewardsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [birthday, setBirthday] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preaching, setPreaching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [postFeedback, setPostFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const queryKey = ["rewards", user?.id];
  const account = useQuery({
    queryKey,
    queryFn: () => rewardService.account(user!.id),
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (!user || !supabase) return;
    const channel = supabase
      .channel(`rewards-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "customer_reward_accounts", filter: `customer_id=eq.${user.id}` }, () => {
        void queryClient.invalidateQueries({ queryKey });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "reward_transactions", filter: `customer_id=eq.${user.id}` }, () => {
        void queryClient.invalidateQueries({ queryKey });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "instagram_posts", filter: `customer_id=eq.${user.id}` }, () => {
        void queryClient.invalidateQueries({ queryKey });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "reward_redemptions", filter: `customer_id=eq.${user.id}` }, () => {
        void queryClient.invalidateQueries({ queryKey });
      })
      .subscribe();
    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [queryClient, user, user?.id]);

  useEffect(() => {
    if (account.data) setBirthday(account.data.birthday);
  }, [account.data]);

  const refresh = () => queryClient.invalidateQueries({ queryKey });
  const runAction = async (action: () => Promise<void>, success: string) => {
    setBusy(true);
    setMessage("");
    try {
      await action();
      await refresh();
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "That action could not be completed.");
    } finally {
      setBusy(false);
    }
  };

  const saveBirthday = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return runAction(() => rewardService.saveBirthday(birthday), "Your birthday has been saved.");
  };

  const submitPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!user || !image) {
      setPostFeedback({ type: "error", text: "Choose a screenshot before submitting." });
      return;
    }
    setBusy(true);
    setPostFeedback(null);
    try {
      await rewardService.submitInstagramPost(user.id, image, preaching);
      setImage(null);
      setPreaching(false);
      form.reset();
      await refresh();
      setPostFeedback({ type: "success", text: "Sent successfully. The Selah team will review your post." });
    } catch (error) {
      setPostFeedback({
        type: "error",
        text: error instanceof Error ? error.message : "Your screenshot could not be sent. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  const balance = account.data?.balance ?? 0;

  return (
    <StoreLayout>
      <main className="container-page min-h-[70vh] py-16 md:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">A little thank-you from Selah</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">Selah rewards</h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Shop, share your Selah story, and turn your points into gifts.
          </p>
        </header>

        {!user ? (
          <section className="mx-auto mt-12 max-w-xl border-y border-border py-10 text-center">
            <h2 className="font-display text-3xl">Your points are waiting</h2>
            <p className="mt-3 text-sm text-muted-foreground">Sign in to see your balance and manage your rewards.</p>
            <Link to="/login" className="mt-6 inline-flex bg-primary px-6 py-3 text-sm text-primary-foreground">Sign in</Link>
          </section>
        ) : (
          <>
            <section className="mx-auto mt-12 flex max-w-5xl flex-col items-start justify-between gap-5 border-y border-border py-7 sm:flex-row sm:items-center">
              <div>
                <p className="eyebrow">Your balance</p>
                <p className="mt-1 font-display text-5xl">{account.isLoading ? "..." : balance} <span className="text-2xl">points</span></p>
                {account.isError && <p className="mt-2 text-sm text-red-700">Your points could not be loaded. Refresh and try again.</p>}
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                7 points gets you a free face mask. 15 points gets you a free spa day.
              </p>
            </section>

            <div className="mx-auto mt-12 grid max-w-5xl gap-12 md:grid-cols-2">
              <section>
                <p className="eyebrow">Earn points</p>
                <h2 className="mt-2 font-display text-3xl">Every point counts</h2>
                <ul className="mt-5 divide-y divide-border border-y border-border">
                  {earningRules.map(([action, points]) => (
                    <li key={action} className="flex justify-between gap-5 py-4 text-sm">
                      <span>{action}</span><strong className="shrink-0 text-right">{points}</strong>
                    </li>
                  ))}
                </ul>

                <form onSubmit={saveBirthday} className="mt-7 border-b border-border pb-7">
                  <label htmlFor="birthday" className="block text-sm font-medium">Your birthday</label>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input id="birthday" type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} required className="h-11 min-w-0 flex-1 border border-border bg-background px-3 text-sm" />
                    <button type="submit" disabled={busy || !birthday} className="h-11 bg-primary px-5 text-sm text-primary-foreground disabled:opacity-50">Save birthday</button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">On your birthday, we’ll add 5 points and arrange a free face mask.</p>
                </form>

                <form onSubmit={submitPost} className="mt-7 space-y-4">
                  <div>
                    <h3 className="font-display text-2xl">Share your Selah story</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Upload a screenshot of your Instagram post. Our team will review it before any points are added.</p>
                  </div>
                  <label htmlFor="instagram-evidence" className="block text-sm font-medium">Post screenshot</label>
                  <input id="instagram-evidence" type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => {
                    const selected = event.target.files?.[0] ?? null;
                    if (selected && selected.size > MAX_INSTAGRAM_SCREENSHOT_BYTES) {
                      setImage(null);
                      event.target.value = "";
                      setPostFeedback({ type: "error", text: "Choose a screenshot smaller than 5 MB." });
                      return;
                    }
                    setImage(selected);
                    setPostFeedback(null);
                  }} className="block w-full text-sm file:mr-4 file:h-10 file:border-0 file:bg-secondary file:px-4 file:text-sm" />
                  <p className="text-xs text-muted-foreground">JPG, PNG, or WebP, up to 5 MB.</p>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" checked={preaching} onChange={(event) => setPreaching(event.target.checked)} className="mt-1 size-4 accent-primary" />
                    <span>My post shows me wearing Selah clothes while preaching or evangelising.</span>
                  </label>
                  <button type="submit" disabled={busy || !image} className="h-11 bg-primary px-5 text-sm text-primary-foreground disabled:opacity-50">Send for review</button>
                  {postFeedback ? (
                    <p role={postFeedback.type === "error" ? "alert" : "status"} aria-live="polite" className={`text-sm ${postFeedback.type === "success" ? "text-emerald-700" : "text-red-700"}`}>
                      {postFeedback.text}
                    </p>
                  ) : null}
                </form>
              </section>

              <section>
                <p className="eyebrow">Use your points</p>
                <h2 className="mt-2 font-display text-3xl">Choose a gift</h2>
                <div className="mt-5 divide-y divide-border border-y border-border">
                  {([
                    ["face_mask", "Free face mask", 7],
                    ["spa_day", "Free spa day", 15],
                  ] as const).map(([reward, label, cost]) => (
                    <div key={reward} className="flex items-center justify-between gap-4 py-5">
                      <div><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs text-muted-foreground">{cost} points</p></div>
                      <button type="button" disabled={busy || balance < cost} onClick={() => void runAction(() => rewardService.redeem(reward), `Your ${label.toLowerCase()} has been requested.`)} className="h-10 border border-foreground px-4 text-sm disabled:cursor-not-allowed disabled:opacity-40">Redeem</button>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <h3 className="font-display text-2xl">Your recent activity</h3>
                  {account.data?.transactions.length ? (
                    <ul className="mt-4 divide-y divide-border border-y border-border">
                      {account.data.transactions.map((transaction) => (
                        <li key={transaction.id} className="flex justify-between gap-4 py-3 text-sm">
                          <span>{transaction.description}<span className="mt-1 block text-xs text-muted-foreground">{new Date(transaction.created_at).toLocaleDateString()}</span></span>
                          <strong className="shrink-0">{transaction.points > 0 ? "+" : ""}{transaction.points}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="mt-4 text-sm text-muted-foreground">Your points activity will appear here.</p>}
                  {account.data?.redemptions.length ? (
                    <div className="mt-7">
                      <h4 className="text-sm font-medium">Your gifts</h4>
                      <ul className="mt-3 divide-y divide-border border-y border-border">
                        {account.data.redemptions.map((redemption) => (
                          <li key={redemption.id} className="flex justify-between gap-4 py-3 text-sm">
                            <span>{redemption.reward === "face_mask" ? "Free face mask" : "Free spa day"}<span className="mt-1 block text-xs capitalize text-muted-foreground">{redemption.status}</span></span>
                            <strong className="shrink-0">{redemption.points_cost ? `${redemption.points_cost} points` : "Birthday gift"}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {account.data?.submissions.length ? (
                    <div className="mt-7">
                      <h4 className="text-sm font-medium">Instagram submissions</h4>
                      <ul className="mt-3 divide-y divide-border border-y border-border">
                        {account.data.submissions.map((submission) => (
                          <li key={submission.id} className="flex justify-between gap-4 py-3 text-sm">
                            <span>{submission.preaching ? "Preaching or evangelising post" : "Selah outfit post"}<span className="mt-1 block text-xs capitalize text-muted-foreground">{submission.status.replaceAll("_", " ")}</span></span>
                            <strong>{submission.points ? `+${submission.points}` : submission.status === "pending" ? "Under review" : "0 points"}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
            {message && <p role="status" className="mx-auto mt-8 max-w-5xl text-sm">{message}</p>}
          </>
        )}
      </main>
    </StoreLayout>
  );
}
