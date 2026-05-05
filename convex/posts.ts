import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const add = mutation({
  args: {
    authorId: v.string(),
    type: v.string(),
    content: v.string(),
    title: v.optional(v.string()),
    image: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      ...args,
      likes: [],
      commentCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const like = mutation({
  args: { postId: v.id("posts"), userId: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return;

    const likes = post.likes.includes(args.userId)
      ? post.likes.filter((id) => id !== args.userId)
      : [...post.likes, args.userId];

    await ctx.db.patch(args.postId, { likes });
  },
});
