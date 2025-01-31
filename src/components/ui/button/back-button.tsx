"use client";

import Link from "next/link";
import { Button } from "./button";

type BackButtonProps = {
    label: string;
    href: string;
};

export const BackButton = ({ label, href }: BackButtonProps) => {
    return (
        <Button variant="link" className="w-full font-normal" size="sm" asChild>
            <Link href={href} className=" underline hover:opacity-80">
                {label}
            </Link>
        </Button>
    );
};
