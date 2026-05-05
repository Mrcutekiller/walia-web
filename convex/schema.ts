import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    uid: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    photoURL: v.optional(v.string()),
    waliaPoints: v.number(),
    isPro: v.boolean(),
    followers: v.array(v.string()),
    following: v.array(v.string()),
    level: v.number(),
    dailyAiCount: v.number(),
    dailyUploadCount: v.number(),
    lastLoginDate: v.string(),
  }).index("by_uid", ["uid"]),

  posts: defineTable({
    authorId: v.string(),
    type: v.string(), // 'quiz' | 'note' | 'ai_share' | 'general' | 'text'
    title: v.optional(v.string()),
    content: v.string(),
    image: v.optional(v.string()),
    likes: v.array(v.string()),
    commentCount: v.number(),
    tags: v.optional(v.array(v.string())),
    isAdminPost: v.optional(v.boolean()),
    isPrivate: v.optional(v.boolean()),
    createdAt: v.number(),
  }).index("by_author", ["authorId"]),

  notifications: defineTable({
    userId: v.string(),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
