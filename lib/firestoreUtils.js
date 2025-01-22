import {
    doc,
    collection,
    addDoc,
    getDoc,
    increment,
    updateDoc,
    setDoc,
    deleteField,
    getDocs,
    orderBy,
    deleteDoc,
    serverTimestamp,
    query,
} from "firebase/firestore";
import { firestore, postToJSON } from "./firebase";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

export function basicUserData(user) {
    if (!user) {
        console.error("no user");
        return null;
    }
    const userData = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        userId: user.uid,
    };
    return userData;
}

export async function savePost(userId, slug) {
    const saveRef = doc(firestore, `users/${userId}/saved/${slug}`);
    const postPath = `posts/${slug}`;
    try {
        await setDoc(saveRef, {
            postPath,
            savedAt: serverTimestamp(),
        });
        await updateCount(postPath, 1, "saveCount");
    } catch (error) {
        console.error("Error saving post:", error);
    }
}

// Remove a post from the user's reading list
export async function unsavePost(userId, slug) {
    const saveRef = doc(firestore, `users/${userId}/saved/${slug}`);
    try {
        await deleteDoc(saveRef);
        updateCount(`posts/${slug}`, -1, "saveCount");
    } catch (error) {
        console.error("Error unsaving post:", error);
    }
}

export async function getPostByPath(postPath) {
    const postRef = doc(firestore, postPath);
    const snapshot = await getDoc(postRef);

    if (snapshot.exists()) {
        return postToJSON(snapshot);
    } else {
        console.warn(`No post found at path: ${postPath}`);
        return null;
    }
}

export function useDeletePost() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentPostRef, setCurrentPostRef] = useState(null);
    const router = useRouter();

    const openModal = (postRef) => {
        setCurrentPostRef(postRef);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentPostRef(null);
    };

    const confirmDelete = async () => {
        try {
            await deleteDoc(currentPostRef);
            closeModal();
            router.push("/admin");
            toast.success("Post deleted successfully!", { icon: "🗑️" });
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
}

export async function checkIfPostBySlug(slug) {
    if (!slug) {
        return false;
    }
    const postRef = doc(firestore, `posts/${slug}`);
    try {
        const snapshot = await getDoc(postRef);
        const exists = snapshot.exists();
        if (exists) {
            console.log("FN Slug Exists:", exists);
            return exists;
        }
        return false;
    } catch (error) {
        console.error("Error checking if post exists:", error);
    }
}

export async function checkIfPostIsSaved(userId, slug) {
    const saveRef = doc(firestore, `users/${userId}/saved/${slug}`);
    try {
        const snapshot = await getDoc(saveRef);
        const exists = snapshot.exists();
        return exists;
    } catch (error) {
        console.error("Error checking if post is saved:", error);
    }
}

export async function fetchSavedPosts(userId) {
    const savedRef = collection(firestore, `users/${userId}/saved`);
    const savedQuery = query(savedRef, orderBy("savedAt", "desc"));

    try {
        const snapshot = await getDocs(savedQuery);
        if (snapshot.empty) {
            console.warn("No saved posts found for userId:", userId);
            return [];
        }
        const postPaths = snapshot.docs.map((doc) => doc.data().postPath);

        const posts = await Promise.all(
            postPaths.map(async (path) => {
                const post = await getPostByPath(path);
                return post || null;
            })
        );

        return posts.filter(Boolean);
    } catch (error) {
        console.error("Error fetching saved posts:", error);
        throw error;
    }
}

export async function addComment(postPath, commentData) {
    const commentsRef = collection(firestore, `${postPath}/comments`);
    try {
        await addDoc(commentsRef, {
            ...commentData,
            repliesCount: 0,
            likes: 0,
            likedBy: {},
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding comment:", error);
    }
}

export async function addReply(commentPath, replyData) {
    const repliesRef = collection(firestore, `${commentPath}/replies`);
    try {
        await addDoc(repliesRef, {
            ...replyData,
            likes: 0,
            likedBy: {},
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding reply:", error);
    }
}

export async function fetchReplies(commentPath) {
    const repliesRef = collection(firestore, `${commentPath}/replies`);
    try {
        const repliesQuery = query(repliesRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(repliesQuery);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching replies:", error);
        throw error;
    }
}

export async function toggleLike(path, userId, isLiked) {
    const ref = doc(firestore, path);
    if (isLiked) {
        // Unlike the reply
        await updateDoc(ref, {
            [`likedBy.${userId}`]: deleteField(),
            likes: increment(-1),
        });
    } else {
        // Like the reply
        await updateDoc(ref, {
            [`likedBy.${userId}`]: true,
            likes: increment(1),
        });
    }
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function replyToJSON(doc) {
    const data = doc.data();

    return {
        ...data,
        createdAt: data?.createdAt?.toMillis
            ? data.createdAt.toMillis()
            : Date.now(),
    };
}

export async function updateCount(postPath, incrementValue, countId) {
    const postRef = doc(firestore, postPath);
    await updateDoc(postRef, {
        [countId]: increment(incrementValue),
    });
}
