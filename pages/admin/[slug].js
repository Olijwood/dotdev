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
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { useDeletePost } from "@/lib/firestoreUtils";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminPostEdit({}) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;

    const postRef = doc(firestore, "posts", slug);

    const [post] = useDocumentDataOnce(postRef);

    return (
        <main>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm
                            postRef={postRef}
                            defaultValues={post}
                            preview={preview}
                        />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>
                            {preview ? "Edit" : "Preview"}
                        </button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button
                                className="btn-blue"
                                style={{ width: "94%" }}
                            >
                                Live view
                            </button>
                        </Link>
                        <DeletePostButton postRef={postRef} />
                    </aside>
                </>
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

                <button
                    type="submit"
                    className="btn-green"
                    disabled={!isDirty || !isValid}
                >
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
