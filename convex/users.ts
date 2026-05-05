import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByUid = query({
  args: { uid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .unique();
  },
});

export const createOrUpdateUser = mutation({
  args: {
    uid: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    photoURL: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name ?? existing.name,
        photoURL: args.photoURL ?? existing.photoURL,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("users", {
        uid: args.uid,
        email: args.email,
        name: args.name,
        photoURL: args.photoURL,
        waliaPoints: 0,
        isPro: false,
        followers: [],
        following: [],
        level: 1,
        dailyAiCount: 0,
        dailyUploadCount: 0,
        lastLoginDate: new Date().toISOString().slice(0, 10),
      });
    }
  },
});

export const addPoints = mutation({
  args: { uid: v.string(), amount: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        waliaPoints: user.waliaPoints + args.amount,
      });
    }
  },
});
