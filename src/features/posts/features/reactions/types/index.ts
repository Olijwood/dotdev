import { ReactionType } from "@prisma/client";

export type ReactionEmoji = "❤️" | "👏" | "🔥" | "👍";
export type Reaction = {
    emoji: ReactionEmoji;
    type: ReactionType;
};

export type UserReaction = {
    userId: string;
    type: ReactionType;
};
