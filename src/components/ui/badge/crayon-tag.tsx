import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const generateTagStyles = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return {
        "--tag-bg": `${randomColor}20`, // 10% opacity
        "--tag-prefix": randomColor,
        "--tag-bg-hover": `${randomColor}30`, // Darker hover color
        "--tag-prefix-hover": `${randomColor}`,
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
    const tagStyles = generateTagStyles(); // ✅ Generate random colors

    return (
        <Link
            href={href || `/t/${tag}`}
            className={cn(crayonTagVariants({ variant }), className)}
            style={tagStyles} // ✅ Apply styles inline
            {...props}
        >
            <span className="crayons-tag__prefix">#</span>
            {tag}
        </Link>
    );
}
