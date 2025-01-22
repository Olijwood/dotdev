import AuthCheck from "@/components/AuthCheck";
import ImageUploader from "@/components/ImageUploader";
import { firestore, auth } from "@/lib/firebase";

import { useState } from "react";
import {
    doc,
    updateDoc,
    serverTimestamp,
    query,
    collection,
    where,
    limit,
} from "firebase/firestore";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm, wa } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { useDeletePost } from "@/lib/firestoreUtils";
import { useRouter } from "next/router";
import Link from "next/link";
import Toolbar from "@/components/Toolbar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckSquare, Eye, PencilIcon, Save, Trash2, View } from "lucide-react";

export default function AdminPostEdit() {
    const router = useRouter();
    const { slug } = router.query;

    const postRef = slug ? doc(firestore, "posts", slug) : null; // Ensure slug is defined
    const [post] = useDocumentDataOnce(postRef);

    return (
        <AuthCheck>
            {post ? (
                <PostManager post={post} postRef={postRef} />
            ) : (
                <p>Loading post data...</p>
            )}
        </AuthCheck>
    );
}

function PostManager({ post, postRef }) {
    const [preview, setPreview] = useState(false);
    const [published, setPublished] = useState(post?.published || false);
    const { register, handleSubmit, watch, formState } = useForm({
        defaultValues: {
            content: post?.content || "",
        },
        mode: "onChange", // Ensures `isValid` is updated as the user types
    });
    const { isValid, isDirty } = formState;
    const { openModal, modal } = useDeletePost();
    const content = watch("content");

    const handleUpdatePost = async (data) => {
        try {
            await updateDoc(postRef, {
                content: data.content,
                published,
                updatedAt: serverTimestamp(),
            });
            toast.success("Post updated successfully!");
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Failed to update post.");
        }
    };

    const handleTogglePublished = async () => {
        const newPublishedStatus = !published;
        setPublished(newPublishedStatus);

        try {
            await updateDoc(postRef, {
                content, // Use the current content
                published: newPublishedStatus, // Update the published status
                updatedAt: serverTimestamp(),
            });
            toast.success(
                `Post ${newPublishedStatus ? "published" : "unpublished"}!`
            );
        } catch (error) {
            console.error("Error updating published status:", error);
            toast.error("Failed to update published status.");
            setPublished(!newPublishedStatus); // Revert state on failure
        }
    };

    return (
        <main>
            {post ? (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <form
                            onSubmit={handleSubmit(handleUpdatePost)}
                            className="controls"
                        >
                            {preview ? (
                                <div className="card">
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                </div>
                            ) : (
                                <div className="controls">
                                    <ImageUploader />

                                    <textarea
                                        {...register("content", {
                                            required: "Content is required",
                                            maxLength: {
                                                value: 20000,
                                                message: "Content is too long",
                                            },
                                            minLength: {
                                                value: 10,
                                                message: "Content is too short",
                                            },
                                        })}
                                        className="textarea"
                                        placeholder="Enter your content..."
                                    />
                                    {formState.errors.content && (
                                        <p className="text-danger">
                                            {formState.errors.content.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </form>
                    </section>

                    <Toolbar>
                        {({ isSmallScreen }) => (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="bar-b"
                                            onClick={() => setPreview(!preview)}
                                        >
                                            {preview ? (
                                                <PencilIcon className="bar-i" />
                                            ) : (
                                                <View className="bar-i" />
                                            )}
                                            <span className="text-md">
                                                {preview ? "Edit" : "Preview"}
                                            </span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{preview ? "Edit" : "Preview"}</p>
                                    </TooltipContent>
                                </Tooltip>
                                {!preview && (
                                    <>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    className="bar-b items-center"
                                                    onClick={
                                                        handleTogglePublished
                                                    }
                                                >
                                                    <CheckSquare
                                                        className={`bar-i ${
                                                            published
                                                                ? "text-green-600"
                                                                : "text-gray-500"
                                                        }`}
                                                    />
                                                    <span className="text-md  ">
                                                        {published
                                                            ? "Published"
                                                            : "Publish"}
                                                    </span>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    {published
                                                        ? "Unpublish"
                                                        : "Publish"}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    className={`bar-b ${
                                                        !isValid || !isDirty
                                                            ? "opacity-40 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                    onClick={handleSubmit(
                                                        handleUpdatePost
                                                    )}
                                                    disabled={
                                                        !isValid || !isDirty
                                                    }
                                                >
                                                    <Save className="bar-i" />
                                                    <span className="text-md">
                                                        Save
                                                    </span>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Save Changes</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </>
                                )}

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={`/${post.username}/${post.slug}`}
                                        >
                                            <button className="bar-b">
                                                <Eye className="bar-i" />
                                                <span className="text-md">
                                                    Live View
                                                </span>
                                            </button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Live View</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="bar-b"
                                            onClick={() => openModal(postRef)}
                                        >
                                            <Trash2 className="bar-i" />
                                            <span className="text-md">
                                                Delete
                                            </span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete</p>
                                    </TooltipContent>
                                </Tooltip>
                                {modal}
                            </>
                        )}
                    </Toolbar>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch, formState } = useForm({
        defaultValues,
        mode: "onChange",
    });

    const { isValid, isDirty } = formState;

    const updatePost = async ({ content, published }) => {
        try {
            await updateDoc(postRef, {
                content,
                published,
                updatedAt: serverTimestamp(),
            });

            reset({ content, published });

            toast.success("Post Updated Successfully!");
        } catch (error) {
            console.error("Error updating post: " + error);
            toast.error("Error updating post");
        }
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch("content")}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? "hidden" : "controls"}>
                <ImageUploader />

                <textarea
                    name="content"
                    {...register("content", {
                        required: {
                            value: true,
                            message: "Content is required",
                        },
                        maxLength: {
                            value: 20000,
                            message: "Content is too long",
                        },
                        minLength: {
                            value: 10,
                            message: "Content is too short",
                        },
                    })}
                ></textarea>
                {formState.errors.content && (
                    <p className="text-danger">
                        {formState.errors.content.message}
                    </p>
                )}

                <fieldset>
                    <input
                        className="w-auto inline"
                        name="published"
                        type="checkbox"
                        {...register("published")}
                    />
                    <label>Published</label>
                </fieldset>

                <button type="submit" disabled={!isDirty || !isValid}>
                    Save Changes
                </button>
            </div>
        </form>
    );
}

function DeletePostButton({ postRef }) {
    const { openModal, modal } = useDeletePost();

    return (
        <>
            <button className="btn-red" onClick={() => openModal(postRef)}>
                Delete
            </button>
            {modal}
        </>
    );
}
