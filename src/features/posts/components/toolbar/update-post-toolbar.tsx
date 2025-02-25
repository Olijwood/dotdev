"use client";

import { PencilIcon, CheckSquare, Eye, Save, Trash2, View } from "lucide-react";
import { HTMLAttributes } from "react";
import { Toolbar } from "@/components/ui/toolbar";
import { useDeletePost } from "../../hooks";
import { PostToolbarItem, PostToolbarItemProps } from "./toolbar-item";

type UpdatePostToolbarProps = HTMLAttributes<HTMLDivElement> & {
    postId: string;
    username: string;
    slug: string;
    preview: boolean;
    handlePreviewToggle: () => void;
    handlePublishedToggle: () => void;
    isPublished: boolean;
    handleSubmit: () => void;
    validState: {
        isValid: boolean;
        isLoading: boolean;
    };
    isMobile?: boolean;
};

export const UpdatePostToolbar = ({
    postId,
    username,
    slug,
    preview,
    handlePreviewToggle,
    handlePublishedToggle,
    isPublished,
    handleSubmit,
    validState,
    isMobile = false,
}: UpdatePostToolbarProps) => {
    const { openModal, modal } = useDeletePost(postId);

    const updatePostToolbarItems: PostToolbarItemProps[] = [
        {
            Icon: preview ? PencilIcon : View,
            tooltipText: preview ? "Edit" : "Preview",
            handleClick: handlePreviewToggle,
            text: preview ? "Edit" : "Preview",
            isEdit: true,
        },
        !preview && {
            Icon: CheckSquare,
            tooltipText: isPublished ? "Unpublish" : "Publish",
            handleClick: handlePublishedToggle,
            iconClassName: isPublished ? "text-green-600" : "text-amber-500",
            text: isPublished ? "Published" : "Publish",
            isEdit: true,
        },
        !preview && {
            Icon: Save,
            tooltipText: "Save Changes",
            handleClick: handleSubmit,
            disabled: !validState.isValid || validState.isLoading,
            text: validState.isLoading ? "Saving..." : "Save",
            isEdit: true,
        },
        {
            Icon: Eye,
            tooltipText: "Live View",
            href: `/${username}/${slug}`,
            text: "Live View",
            isEdit: true,
        },
        {
            Icon: Trash2,
            tooltipText: "Delete",
            handleClick: openModal,
            text: "Delete",
            isEdit: true,
        },
    ].filter(Boolean) as PostToolbarItemProps[];

    return (
        <Toolbar
            isMobile={isMobile}
            className=" sm:w-20 sm:!border sm:!border-gray-300"
        >
            {updatePostToolbarItems.map((item, index) => (
                <PostToolbarItem key={index} {...item} />
            ))}
            {modal}
        </Toolbar>
    );
};
