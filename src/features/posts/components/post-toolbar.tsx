import {
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    MoreHorizontal,
} from "lucide-react";
import type React from "react"; // Import React
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    isMobile?: boolean;
}

export function PostActions({
    isMobile,
    className,
    ...props
}: PostActionsProps) {
    const actions = [
        { icon: Heart, label: "Like", count: 134 },
        { icon: MessageCircle, label: "Comment", count: 8 },
        { icon: Bookmark, label: "Save", count: 207 },
        { icon: Share2, label: "Share" },
        { icon: MoreHorizontal, label: "More" },
    ];

    return (
        <div
            className={cn(
                "flex",
                isMobile ? "justify-around py-2 px-4" : "flex-col gap-4",
                className,
            )}
            {...props}
        >
            {actions.map((action) => (
                <Button
                    key={action.label}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "flex items-center gap-1.5",
                        !isMobile && "flex-col",
                    )}
                >
                    <action.icon className="size-5" />
                    {action.count && !isMobile && (
                        <span className="text-sm">{action.count}</span>
                    )}
                </Button>
            ))}
        </div>
    );
}
