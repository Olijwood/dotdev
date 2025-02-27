import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

type RepliesBtnProps = {
    nReplies: number;
    handleClick: () => void;
};

export const RepliesBtn = ({ nReplies, handleClick }: RepliesBtnProps) => {
    return (
        <Button
            variant="ghost"
            type="button"
            size="sm"
            className="flex items-center gap-1 "
            onClick={handleClick}
        >
            <MessageSquare className="size-4" />
            <span className="text-gray-500">{nReplies}</span>
        </Button>
    );
};
