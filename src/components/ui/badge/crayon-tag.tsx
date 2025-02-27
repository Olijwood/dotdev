import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const hashStringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `#${((hash & 0xffffff) >>> 0).toString(16).padStart(6, "0")}`;
    return color;
};

const generateTagStyles = (tag: string) => {
    // const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const stableColor = hashStringToColor(tag);
    return {
        "--tag-bg": `${stableColor}20`,
        "--tag-prefix": stableColor,
        "--tag-bg-hover": `${stableColor}30`,
        "--tag-prefix-hover": `${stableColor}`,
    } as CSSProperties;
};

const crayonTagVariants = cva(
    "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                hashtag: "crayons-tag",
            },
        },
        defaultVariants: {
            variant: "hashtag",
        },
    },
);

export interface CrayonTagProps
    extends HTMLAttributes<HTMLAnchorElement>,
        VariantProps<typeof crayonTagVariants> {
    href?: string;
    tag: string;
}

export function CrayonTag({
    className,
    variant,
    tag,
    href,
    ...props
}: CrayonTagProps) {
    const tagStyles = generateTagStyles(tag);

    return (
        <Link
            href={href || `/t/${tag}`}
            className={cn(crayonTagVariants({ variant }), className)}
            style={tagStyles}
            {...props}
        >
            <span className="crayons-tag__prefix">#</span>
            {tag}
        </Link>
    );
}
