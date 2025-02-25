import { PencilIcon, Save, View } from "lucide-react";
import { Toolbar } from "@/components/ui/toolbar";
import { PostToolbarItem, PostToolbarItemProps } from "./toolbar-item";

type CreatePostToolbarProps = {
    isMobile?: boolean;
    preview?: boolean;
    handlePreviewToggle: () => void;
    handleSubmit: () => void;
    validState: {
        isValid: boolean;
        isLoading: boolean;
    };
};

export const CreatePostToolbar = ({
    isMobile = false,
    preview = false,
    handlePreviewToggle,
    handleSubmit,
    validState,
}: CreatePostToolbarProps) => {
    const createPostToolbarItems: PostToolbarItemProps[] = [
        {
            Icon: preview ? PencilIcon : View,
            tooltipText: preview ? "Edit" : "Preview",
            handleClick: handlePreviewToggle,
            text: preview ? "Edit" : "Preview",
            isEdit: true,
        },
        {
            Icon: Save,
            tooltipText: "Save Changes",
            handleClick: handleSubmit,
            disabled: !validState.isValid || validState.isLoading,
            text: validState.isLoading ? "Saving..." : "Save",
            isEdit: true,
        },
    ].filter(Boolean) as PostToolbarItemProps[];

    return (
        <Toolbar isMobile={isMobile} className="min-w-20">
            {createPostToolbarItems.map((item, index) => (
                <PostToolbarItem key={index} {...item} />
            ))}
        </Toolbar>
    );
};
