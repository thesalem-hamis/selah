import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { rewardService } from "@/services/rewardService";

export function InstagramReviewPanel() {
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const queryKey = ["pending-instagram-posts"];
  const posts = useQuery({ queryKey, queryFn: () => rewardService.pendingInstagramPosts() });

  const review = async (id: string, approve: boolean) => {
    setBusyId(id);
    setMessage("");
    try {
      await rewardService.reviewInstagramPost(id, approve);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: ["rewards"] }),
      ]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The submission could not be reviewed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="border-y border-[#E5E5E5] py-8">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Rewards</p>
          <h2 className="mt-2 text-2xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}>
            Instagram submissions
          </h2>
        </div>
        <p className="text-xs text-[#777777]">Points are added only after approval.</p>
      </div>

      {message && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}
      {posts.isLoading ? <p className="mt-5 text-sm text-[#777777]">Loading submissions...</p> : null}
      {posts.isError ? <p className="mt-5 text-sm text-red-700">Submissions could not be loaded.</p> : null}
      {!posts.isLoading && posts.data?.length === 0 ? (
        <p className="mt-5 text-sm text-[#777777]">There are no screenshots waiting for review.</p>
      ) : null}

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {posts.data?.map((post) => (
          <article key={post.id} className="grid gap-4 border border-[#E5E5E5] bg-white p-4 sm:grid-cols-[150px_1fr]">
            <a href={post.signedImage} target="_blank" rel="noreferrer" aria-label="Open screenshot">
              <img src={post.signedImage} alt="Instagram post screenshot" className="aspect-[4/5] w-full object-cover" />
            </a>
            <div className="flex min-w-0 flex-col">
              <p className="text-sm font-medium text-[#1A1A1A]">{post.customer?.name ?? "Customer"}</p>
              <p className="mt-1 break-all text-xs text-[#777777]">{post.customer?.email}</p>
              <p className="mt-4 text-xs text-[#444444]">{post.preaching ? "Wearing Selah while preaching or evangelising" : "Wearing Selah"}</p>
              <p className="mt-2 text-xs text-[#777777]">Submitted {new Date(post.created_at).toLocaleDateString()}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <button type="button" disabled={busyId !== null || !post.signedImage} onClick={() => void review(post.id, true)} className="h-10 bg-[#1A1A1A] px-4 text-xs font-medium text-white disabled:opacity-50">
                  {busyId === post.id ? "Saving..." : `Approve ${post.preaching ? "10" : "5"} points`}
                </button>
                <button type="button" disabled={busyId !== null} onClick={() => void review(post.id, false)} className="h-10 border border-[#E5E5E5] px-4 text-xs font-medium text-[#1A1A1A] disabled:opacity-50">
                  Reject
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}