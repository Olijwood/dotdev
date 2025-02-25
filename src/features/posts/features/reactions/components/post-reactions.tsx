import { ReactionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { reactionsDict } from "../constants";

type PostReactionsProps = React.HTMLAttributes<HTMLDivElement> & {
    reactions: Record<ReactionType, number>;
    vertical?: boolean;
};

export function PostReactions({
    reactions,
    vertical = false,
    className,
    ...props
}: PostReactionsProps) {
    return (
        <div
            className={cn(
                "flex gap-1",
                vertical && "flex-col items-center",
                className,
            )}
            {...props}
        >
            {Object.entries(reactions).map(([type, count]) => (
                <Button
                    key={type}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "flex items-center gap-1 hover:bg-transparent cursor-default",
                        vertical && "flex-col",
                    )}
                >
                    <span>{reactionsDict[type as ReactionType]}</span>
                    <span className="text-sm">{count}</span>
                </Button>
            ))}
        </div>
    );
}
