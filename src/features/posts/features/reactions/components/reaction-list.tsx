"yse client";

import { ReactionType } from "@prisma/client";
import { reactionsList } from "../constants";
import { ReactionButton } from "./reaction-button";

type ReactionListProps = {
    reactions: { type: ReactionType; userId: string }[];
    userId: string | undefined;
    handleReactionToggle: (type: ReactionType) => Promise<void>;
};

export const ReactionList = ({
    reactions,
    userId,
    handleReactionToggle,
}: ReactionListProps) => {
    if (!userId) {
        return null;
    }
    return (
        <div className="grid grid-cols-4 gap-2">
            {reactionsList.map(({ type, emoji }) => {
                const isReacted = reactions.some(
                    (r) => r.type === type && r.userId === userId,
                );
                const reactionCount = reactions.filter(
                    (r) => r.type === type,
                ).length;

                return (
                    <ReactionButton
                        key={`reaction-${type}`}
                        type={type}
                        emoji={emoji}
                        isReacted={isReacted}
                        reactionCount={reactionCount}
                        handleClick={() => handleReactionToggle(type)}
                    />
                );
            })}
        </div>
    );
};
