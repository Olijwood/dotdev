"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type PostToolbarItemProps = {
    isEdit?: boolean;
    Icon: LucideIcon;
    iconClassName?: string;
    text?: string;
    tooltipText: string;
    handleClick?: () => void;
    href?: string;
    disabled?: boolean;
    testid?: string;
};

export const PostToolbarItem = ({
    isEdit = false,
    Icon,
    iconClassName = "",
    text,
    tooltipText,
    handleClick,
    href,
    testid,
    disabled = false,
}: PostToolbarItemProps) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {href ? (
                    <Link href={href} className="flex w-full items-center">
                        <Button
                            variant="ghost"
                            className={cn(
                                "!mx-0 w-full flex-col",
                                isEdit ? "e-bar-b" : "bar-b",
                            )}
                            data-testid={testid}
                        >
                            <ToolbarButtonContent
                                isEdit={isEdit}
                                Icon={Icon}
                                iconClassName={iconClassName}
                                text={text}
                            />
                        </Button>
                    </Link>
                ) : (
                    <Button
                        variant="ghost"
                        className={cn(
                            "flex-col",
                            isEdit ? "e-bar-b" : "bar-b",
                            disabled && "opactiy-40 cursor-not-allowed",
                        )}
                        onClick={handleClick}
                        disabled={disabled}
                        data-testid={testid}
                    >
                        <ToolbarButtonContent
                            isEdit={isEdit}
                            Icon={Icon}
                            iconClassName={iconClassName}
                            text={text}
                        />
                    </Button>
                )}
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
};

type ToolbarButtonContentProps = {
    isEdit?: boolean;
    Icon: LucideIcon;
    iconClassName?: string;
    text?: string;
};

export const ToolbarButtonContent = ({
    isEdit = false,
    Icon,
    iconClassName = "",
    text,
}: ToolbarButtonContentProps) => {
    if (isEdit) {
        return (
            <>
                <Icon className={cn("e-bar-i", iconClassName)} />
                {text && <span className="text-xs">{text}</span>}
            </>
        );
    }
    return (
        <>
            <Icon className={cn("bar-i", iconClassName)} />
            {text && <span className="text-lg ">{text}</span>}
        </>
    );
};
