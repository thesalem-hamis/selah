import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { rewardService } from "@/services/rewardService";
import { Check, Gift, Instagram, X } from "lucide-react";

export const Route = createFileRoute("/admin/rewards")({ component: AdminRewards });

function AdminRewards() {
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const submissions = useQuery({
    queryKey: ["admin-instagram-rewards"],
    queryFn: () => rewardService.pendingInstagramPosts(),
  });
  const redemptions = useQuery({
    queryKey: ["admin-reward-redemptions"],
    queryFn: () => rewardService.pendingRedemptions(),
  });

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-instagram-rewards"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-reward-redemptions"] }),
    ]);
  };

  const reviewPost = async (postId: string, approve: boolean) => {
    setBusyId(postId);
    setMessage("");
    try {
      await rewardService.reviewInstagramPost(postId, approve);
      await refresh();
      setMessage(approve ? "Post approved and points added." : "Post declined.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The post could not be reviewed.");
    } finally {
      setBusyId(null);
    }
  };

  const fulfillGift = async (redemptionId: string) => {
    setBusyId(redemptionId);
    setMessage("");
    try {
      await rewardService.fulfillRedemption(redemptionId);
      await refresh();
      setMessage("Gift marked as fulfilled.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The gift could not be updated.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <header className="border-b border-[#E5E5E5] pb-7">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]"><Gift className="size-4" /> Customer care</p>
        <h1 className="mt-4 text-4xl text-[#1A1A1A] md:text-5xl" style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}>Rewards</h1>
        <p className="mt-3 text-sm text-[#777777]">Review customer posts and fulfil their gifts.</p>
      </header>

      <section>
        <h2 className="flex items-center gap-2 text-xl"><Instagram className="size-5" /> Instagram posts</h2>
        {submissions.isLoading ? <p className="mt-5 text-sm text-muted-foreground">Loading submissions...</p> : null}
        {submissions.isError ? <p className="mt-5 text-sm text-red-700">Submissions could not be loaded.</p> : null}
        {!submissions.isLoading && !submissions.isError && !submissions.data?.length ? <p className="mt-5 border-y border-border py-5 text-sm text-muted-foreground">No posts are waiting for review.</p> : null}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {submissions.data?.map((post) => (
            <article key={post.id} className="border border-border bg-background">
              {post.signedImage ? <a href={post.signedImage} target="_blank" rel="noreferrer"><img src={post.signedImage} alt="Customer Instagram post evidence" className="aspect-[4/3] w-full object-contain bg-secondary" /></a> : <div className="flex aspect-[4/3] items-center justify-center bg-secondary text-sm text-muted-foreground">Screenshot unavailable</div>}
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-sm font-medium">{post.customer?.name ?? "Selah customer"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{post.preaching ? "Selah outfit while preaching or evangelising · 10 points" : "Selah outfit post · 5 points"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" disabled={busyId === post.id} onClick={() => void reviewPost(post.id, true)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 bg-primary px-3 text-sm text-primary-foreground disabled:opacity-50"><Check className="size-4" /> Approve</button>
                  <button type="button" disabled={busyId === post.id} onClick={() => void reviewPost(post.id, false)} className="inline-flex h-10 items-center justify-center gap-2 border border-border px-3 text-sm disabled:opacity-50"><X className="size-4" /> Decline</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-xl"><Gift className="size-5" /> Gifts to fulfil</h2>
        {redemptions.isLoading ? <p className="mt-5 text-sm text-muted-foreground">Loading gifts...</p> : null}
        {redemptions.isError ? <p className="mt-5 text-sm text-red-700">Gifts could not be loaded.</p> : null}
        {!redemptions.isLoading && !redemptions.isError && !redemptions.data?.length ? <p className="mt-5 border-y border-border py-5 text-sm text-muted-foreground">No gifts are waiting to be fulfilled.</p> : null}
        {redemptions.data?.length ? <ul className="mt-5 divide-y divide-border border-y border-border">
          {redemptions.data.map((redemption) => (
            <li key={redemption.id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium">{redemption.reward === "face_mask" ? "Free face mask" : "Free spa day"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{redemption.customer?.name ?? "Selah customer"} · {new Date(redemption.created_at).toLocaleDateString()}</p>
              </div>
              <button type="button" disabled={busyId === redemption.id} onClick={() => void fulfillGift(redemption.id)} className="h-10 border border-foreground px-4 text-sm disabled:opacity-50">Mark fulfilled</button>
            </li>
          ))}
        </ul> : null}
      </section>
      {message ? <p role="status" className="text-sm">{message}</p> : null}
    </div>
  );
}