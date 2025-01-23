import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import kebabCase from "lodash.kebabcase";
import { auth, firestore } from "@/lib/firebase";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { UserContext } from "@/lib/context";

import { checkIfPostBySlug } from "@/lib/firestoreUtils";

export default function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);

    const { register, handleSubmit, setValue, control, formState } = useForm({
        defaultValues: {
            title: "",
            slug: "",
        },
    });
    const [validSlugMsg, setValidSlugMsg] = useState("");
    const [isValid, setIsValid] = useState(false);

    const slug = useWatch({ control, name: "slug" });

    useEffect(() => {
        const validateSlug = async () => {
            if (slug.length > 3 && slug.length < 100) {
                const exists = await checkIfPostBySlug(slug);
                setValidSlugMsg(exists ? "This slug is already in use!" : "");
                setIsValid(!exists);
            } else {
                setValidSlugMsg("");
                setIsValid(false);
            }
        };
        if (slug) validateSlug();
    }, [slug]);

    const createPost = async (data) => {
        const uid = auth.currentUser.uid;
        const ref = doc(firestore, `posts/${data.slug}`);

        const postData = {
            title: data.title,
            slug: data.slug,
            uid,
            username,
            published: false,
            content: `# **${data.title}**`,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
            reactionCount: 0,
            commentCount: 0,
            saveCount: 0,

            reactions: {
                heart: 0,
                clap: 0,
                fire: 0,
                "thumbs up": 0,
            },
        };

        setDoc(ref, postData)
            .then(() => {
                toast.success("Post Created!");
                router.push(`/admin/${slug}`);
            })
            .catch((err) => toast.error(err.message));
    };
    return (
        <>
            <h1 className="text-3xl font-semibold text-center mb-4">
                Create a New Post
            </h1>
            <div className="rounded-lg card mx-auto p-5 w-full mb-6">
                <form
                    onSubmit={handleSubmit(createPost)}
                    className="space-y-4 text-center"
                >
                    <div className="flex flex-col">
                        <label
                            htmlFor="title"
                            className="text-sm font-medium text-gray-700 mb-1"
                        >
                            Post Title
                        </label>
                        <input
                            id="title"
                            {...register("title", {
                                required: "Title is required",
                                minLength: {
                                    value: 4,
                                    message:
                                        "Title must be at least 4 characters",
                                },
                                maxLength: {
                                    value: 100,
                                    message:
                                        "Title must be less than 100 characters",
                                },
                                onChange: (e) => {
                                    const value = e.target.value;
                                    setValue(
                                        "slug",
                                        encodeURI(kebabCase(value)),
                                        {
                                            shouldValidate: true,
                                        }
                                    );
                                },
                            })}
                            placeholder="Enter your post title"
                            className="text-center border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col ">
                        <label
                            htmlFor="slug"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Post Slug
                        </label>
                        <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md">
                            {slug || "Slug will appear here..."}
                        </div>
                        {validSlugMsg && (
                            <p className="text-sm text-red-500 mt-1">
                                {validSlugMsg}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full px-4 py-2 text-white font-medium rounded-md ${
                            isValid
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-300 cursor-not-allowed"
                        } transition duration-150`}
                    >
                        Create New Post
                    </button>
                </form>
            </div>
        </>
    );
}
