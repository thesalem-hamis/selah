import { supabase } from "@/lib/supabase";

export const MAX_INSTAGRAM_SCREENSHOT_BYTES = 5 * 1024 * 1024;

export interface RewardTransaction {
  id: string;
  points: number;
  type: "earn" | "redeem" | "refund" | "adjustment";
  description: string;
  created_at: string;
}

export interface InstagramSubmission {
  id: string;
  image_url: string;
  preaching: boolean;
  status: "pending" | "approved" | "rejected";
  points: number;
  created_at: string;
}

export interface RewardRedemption {
  id: string;
  reward: "face_mask" | "spa_day";
  points_cost: number;
  status: "pending" | "fulfilled" | "cancelled";
  created_at: string;
}

export interface RewardAccount {
  balance: number;
  birthday: string;
  transactions: RewardTransaction[];
  submissions: InstagramSubmission[];
  redemptions: RewardRedemption[];
}

function requireClient() {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export const rewardService = {
  async account(customerId: string): Promise<RewardAccount> {
    const client = requireClient();
    const { error: ensureError } = await client.rpc("ensure_reward_account");
    if (ensureError) throw new Error(ensureError.message);
    const { error: birthdayError } = await client.rpc("claim_birthday_reward");
    if (birthdayError) throw new Error(birthdayError.message);

    const [account, transactions, submissions, redemptions, profile] = await Promise.all([
      client.from("customer_reward_accounts").select("points_balance").eq("customer_id", customerId).single(),
      client.from("reward_transactions").select("id,points,type,description,created_at").eq("customer_id", customerId).order("created_at", { ascending: false }).limit(20),
      client.from("instagram_posts").select("id,image_url,preaching,status,points,created_at").eq("customer_id", customerId).order("created_at", { ascending: false }).limit(10),
      client.from("reward_redemptions").select("id,reward,points_cost,status,created_at").eq("customer_id", customerId).order("created_at", { ascending: false }).limit(10),
      client.from("profiles").select("date_of_birth").eq("id", customerId).maybeSingle(),
    ]);

    for (const result of [account, transactions, submissions, redemptions, profile]) {
      if (result.error) throw new Error(result.error.message);
    }

    return {
      balance: Number(account.data.points_balance),
      birthday: profile.data?.date_of_birth ? String(profile.data.date_of_birth).slice(0, 10) : "",
      transactions: transactions.data ?? [],
      submissions: submissions.data ?? [],
      redemptions: redemptions.data ?? [],
    };
  },

  async saveBirthday(date: string) {
    const { error } = await requireClient().rpc("save_reward_birthday", { p_birthday: date });
    if (error) throw new Error(error.message);
    const { error: claimError } = await requireClient().rpc("claim_birthday_reward");
    if (claimError) throw new Error(claimError.message);
  },

  async submitInstagramPost(customerId: string, file: File, preaching: boolean) {
    const client = requireClient();
    if (file.size > MAX_INSTAGRAM_SCREENSHOT_BYTES) {
      throw new Error("Choose a screenshot smaller than 5 MB.");
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Choose a JPG, PNG, or WebP screenshot.");
    }
    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${customerId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await client.storage.from("rewards-evidence").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) {
      const message = uploadError.message.toLowerCase();
      if (message.includes("maximum allowed size") || message.includes("payload too large")) {
        throw new Error("The screenshot could not be uploaded because it exceeds the storage limit. Choose one under 5 MB. If it is already smaller, the storage limit needs updating.");
      }
      throw new Error(uploadError.message);
    }
    const { error: insertError } = await client.from("instagram_posts").insert({
      customer_id: customerId,
      image_url: path,
      preaching,
      status: "pending",
      points: 0,
    });
    if (insertError) {
      await client.storage.from("rewards-evidence").remove([path]);
      throw new Error(insertError.message);
    }
  },

  async redeem(reward: "face_mask" | "spa_day") {
    const { error } = await requireClient().rpc("redeem_reward", { p_reward: reward });
    if (error) throw new Error(error.message);
  },

  async pendingInstagramPosts() {
    const client = requireClient();
    const { data, error } = await client
      .from("instagram_posts")
      .select("id,customer_id,image_url,preaching,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const posts = data ?? [];
    const customerIds = [...new Set(posts.map((post) => post.customer_id))];
    const [profiles, signedImages] = await Promise.all([
      customerIds.length
        ? client.from("profiles").select("id,name").in("id", customerIds)
        : Promise.resolve({ data: [], error: null }),
      Promise.all(posts.map((post) => client.storage.from("rewards-evidence").createSignedUrl(post.image_url, 300))),
    ]);
    if (profiles.error) throw new Error(profiles.error.message);
    const profileById = new Map((profiles.data ?? []).map((profile) => [profile.id, profile]));
    return posts.map((post, index) => ({
      ...post,
      customer: profileById.get(post.customer_id),
      signedImage: signedImages[index]?.data?.signedUrl ?? "",
    }));
  },

  async pendingRedemptions() {
    const client = requireClient();
    const { data, error } = await client
      .from("reward_redemptions")
      .select("id,customer_id,reward,points_cost,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const redemptions = data ?? [];
    const customerIds = [...new Set(redemptions.map((redemption) => redemption.customer_id))];
    const { data: profiles, error: profileError } = customerIds.length
      ? await client.from("profiles").select("id,name").in("id", customerIds)
      : { data: [], error: null };
    if (profileError) throw new Error(profileError.message);
    const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    return redemptions.map((redemption) => ({
      ...redemption,
      customer: profileById.get(redemption.customer_id),
    }));
  },

  async fulfillRedemption(redemptionId: string) {
    const { error } = await requireClient()
      .from("reward_redemptions")
      .update({ status: "fulfilled", fulfilled_at: new Date().toISOString() })
      .eq("id", redemptionId)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
  },

  async reviewInstagramPost(postId: string, approve: boolean) {
    const { error } = await requireClient().rpc("review_instagram_post", {
      p_post_id: postId,
      p_approve: approve,
    });
    if (error) throw new Error(error.message);
  },
};