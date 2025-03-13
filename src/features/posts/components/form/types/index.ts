import { FormStatus } from "@/types";
import type { Tag } from "../../../types";

export type Post = {
    id: string;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    bannerImgUrl?: string | null;
    username: string;
    tags?: Tag[];
};

export type FormState = {
    status: FormStatus;
    preview: boolean;
    isPublished: boolean;
};
