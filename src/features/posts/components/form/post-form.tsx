"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import kebabCase from "lodash.kebabcase";
import { redirect } from "next/navigation";
import {
    useMemo,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { getStatusValues } from "@/lib/utils";
import { MarkdownToolbar } from "../../features/markdown";
import { useValidateSlug } from "../../hooks";
import {
    actionCreatePost,
    actionUpdatePost,
    actionUpdatePostPublished,
} from "../../server/actions";
import {
    CreatePostToolbar,
    UpdatePostToolbar,
    SidebarContainer,
} from "../toolbar";
import { PostFormContainer, PostFormWrapper } from "./container";
import { PostTitleInput, ImageUploader, TagInput } from "./input";
import { PostFormSchema, PostFormValues } from "./schema";
import type { Post, FormState } from "./types";

export type PostFormHandle = {
    onSubmit: (data: PostFormValues, postId?: string) => Promise<void>;
};

type PostFormProps = {
    post?: Post;
    userId: string;
};

export const PostForm = forwardRef<PostFormHandle, PostFormProps>(
    ({ post, userId }: PostFormProps, ref) => {
        const [{ status, preview, isPublished }, setFormState] =
            useState<FormState>({
                status: { state: "idle" },
                preview: false,
                isPublished: post?.published || false,
            });
        const { watch, register, handleSubmit, setValue, formState } =
            useForm<PostFormValues>({
                resolver: zodResolver(PostFormSchema),
                defaultValues: {
                    title: post?.title || "",
                    slug: post?.slug || "",
                    content: post?.content || "",
                    bannerImgUrl: post?.bannerImgUrl || "",
                    published: post?.published || false,
                    tags: post?.tags?.map((tag) => tag.name) || [],
                },
            });

        const formValues = watch([
            "title",
            "content",
            "bannerImgUrl",
            "slug",
            "tags",
        ]);
        const [title, content, bannerImgUrl, slug, tags] = formValues;

        const { isValid, validSlugMsg } = useValidateSlug(
            slug,
            post?.slug || "",
        );

        const textareaRef = useRef<HTMLTextAreaElement>(null);

        const updateFormState = (updates: Partial<FormState>) => {
            setFormState((prev) => ({ ...prev, ...updates }));
        };
        const onSubmit = async (data: PostFormValues, postId?: string) => {
            updateFormState({ status: { state: "loading" } });

            try {
                const id = postId || null;
                const response = id
                    ? await actionUpdatePost(id, data)
                    : await actionCreatePost(data);

                if (response.error) {
                    toast.error(response.error);
                    return;
                } else {
                    toast.success(response.success);
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong. Please try again.");
            } finally {
                updateFormState({ status: { state: "idle" } });
                if (slug !== post?.slug) {
                    redirect(`/update-post/${slug}`);
                }
            }
        };

        // Expose onSubmit so the test can call it
        useImperativeHandle(ref, () => ({
            onSubmit,
        }));

        const handlePublishedToggle = async () => {
            if (!post) return;
            updateFormState({ status: { state: "loading" } });

            try {
                const response = await actionUpdatePostPublished(
                    post.id,
                    !isPublished,
                );

                if (response.error) {
                    toast.error(response.error);
                } else {
                    updateFormState({ isPublished: !isPublished });
                    toast.success(
                        `Post ${!isPublished ? "published" : "unpublished"}!`,
                    );
                }
            } catch {
                toast.error("Something went wrong.");
            } finally {
                updateFormState({ status: { state: "idle" } });
                redirect(`/update-post/${slug}`);
            }
        };

        const handleBannerImageSuccess = (url: string) =>
            setValue("bannerImgUrl", url);
        const togglePreview = () => updateFormState({ preview: !preview });

        const submitHandler = handleSubmit((data) => {
            const postId = post?.id || undefined;
            return onSubmit(data, postId);
        });

        const previewProps = useMemo(
            () => ({
                title,
                content,
                bannerImgUrl,
            }),
            [title, content, bannerImgUrl],
        );

        const { isLoading } = getStatusValues(status);

        const validState = {
            isValid,
            isLoading,
        };

        return (
            <PostFormContainer>
                <SidebarContainer>
                    {post ? (
                        <UpdatePostToolbar
                            postId={post.id}
                            slug={post.slug}
                            username={post.username}
                            preview={preview}
                            handlePreviewToggle={togglePreview}
                            handlePublishedToggle={handlePublishedToggle}
                            isPublished={isPublished}
                            handleSubmit={submitHandler}
                            validState={validState}
                        />
                    ) : (
                        <CreatePostToolbar
                            preview={preview}
                            handlePreviewToggle={togglePreview}
                            handleSubmit={submitHandler}
                            validState={validState}
                        />
                    )}
                </SidebarContainer>
                <PostFormWrapper
                    onSubmit={submitHandler}
                    isPreview={preview}
                    previewProps={previewProps}
                >
                    {!preview && (
                        <>
                            <div className="p-3 sm:pb-0">
                                <ImageUploader
                                    userId={userId}
                                    onUploadSuccess={handleBannerImageSuccess}
                                    initialUrl={bannerImgUrl}
                                    label="Add Banner Image"
                                />

                                <PostTitleInput
                                    {...register("title")}
                                    onBlur={(e) => {
                                        if (e.target.value !== post?.title) {
                                            setValue(
                                                "slug",
                                                encodeURI(
                                                    kebabCase(e.target.value),
                                                ),
                                                {
                                                    shouldValidate: true,
                                                },
                                            );
                                        }
                                    }}
                                    validSlugMsg={validSlugMsg}
                                />
                                {formState.errors &&
                                    Object.values(formState.errors).map(
                                        (error) => (
                                            <p
                                                className="hidden"
                                                key={error.message}
                                            >
                                                {error.message}
                                            </p>
                                        ),
                                    )}
                                {slug && slug.length > 0 && (
                                    <p
                                        className="hidden"
                                        data-testid="post-slug"
                                    >
                                        {slug}
                                    </p>
                                )}
                                <TagInput
                                    initialTags={tags}
                                    onChange={(tags) => setValue("tags", tags)}
                                />
                            </div>

                            <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-t">
                                <MarkdownToolbar
                                    textareaRef={textareaRef}
                                    content={content}
                                    setContent={(content) =>
                                        setValue("content", content)
                                    }
                                />
                                <div className="flex min-h-0 grow flex-col ">
                                    <Textarea
                                        ref={textareaRef}
                                        value={content}
                                        onChange={(e) =>
                                            setValue("content", e.target.value)
                                        }
                                        placeholder="Write your post content here..."
                                        className="scrollbar-thin min-h-full flex-1 resize-none rounded-none border-0 p-2 text-xs focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {post && (
                        <button
                            type="submit"
                            onClick={() => submitHandler()}
                            className="hidden"
                            data-testid="post-hidden-submit"
                        >
                            Hidden Submit
                        </button>
                    )}
                </PostFormWrapper>

                {post ? (
                    <UpdatePostToolbar
                        postId={post.id}
                        slug={post.slug}
                        username={post.username}
                        preview={preview}
                        handlePreviewToggle={togglePreview}
                        handlePublishedToggle={handlePublishedToggle}
                        isPublished={isPublished}
                        handleSubmit={submitHandler}
                        validState={validState}
                        isMobile
                    />
                ) : (
                    <CreatePostToolbar
                        preview={preview}
                        handlePreviewToggle={togglePreview}
                        handleSubmit={submitHandler}
                        validState={validState}
                        isMobile
                    />
                )}
            </PostFormContainer>
        );
    },
);

PostForm.displayName = "PostForm";
