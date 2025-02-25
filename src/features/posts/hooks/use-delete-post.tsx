"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "../components/modal";
import { deletePostById } from "../server/db";

export const useDeletePost = (postId: string) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const router = useRouter();
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const confirmDelete = async () => {
        try {
            const deleted = await deletePostById(postId);
            if (!deleted) {
                toast.error("Failed to delete post. Please try again.");
            } else {
                toast.success("Post deleted successfully!");
                closeModal();

                router.push("/");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post. Please try again.");
        }
    };

    return {
        openModal,
        modal: (
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
            />
        ),
    };
};
