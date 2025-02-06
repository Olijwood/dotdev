import { ReactionType } from "@prisma/client";

export const reactionsList = [
    { type: ReactionType.CLAP, emoji: "👏" },
    { type: ReactionType.FIRE, emoji: "🔥" },
    { type: ReactionType.HEART, emoji: "❤️" },
    { type: ReactionType.THUMBS_UP, emoji: "👍" },
] as const;
