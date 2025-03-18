"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PostItem } from "@/features/posts/components/list-view";
import type { PostListItem } from "@/features/posts/types";
import {
    SearchBar,
    SearchFilters,
    SearchSort,
    PersonItem,
    CommentItem,
} from "@/features/search/components";
import {
    searchPostsAction,
    searchPeopleAction,
    searchCommentsAction,
} from "@/features/search/server/actions";
import type { Person, Comment } from "@/features/search/types";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams?.get("q") || "";
    const filter = searchParams?.get("filter") || "posts";
    const sort = searchParams?.get("sort") || "relevant";

    const [posts, setPosts] = useState<PostListItem[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        async function fetchSearchResults() {
            if (filter !== "posts" && !query) {
                setPosts([]);
                setPeople([]);
                setComments([]);
                setHasSearched(false);
                return;
            }

            setIsLoading(true);
            setHasSearched(true);

            try {
                if (filter === "posts") {
                    const result = await searchPostsAction({ query, sort });
                    // Map the API response to match the expected Post type
                    const formattedPosts =
                        result.success && result.posts ? result.posts : [];
                    setPosts(formattedPosts);
                } else if (filter === "people") {
                    const result = await searchPeopleAction({ query, sort });
                    setPeople(result.success ? result.people || [] : []);
                } else if (filter === "comments") {
                    const result = await searchCommentsAction({ query, sort });
                    setComments(result.success ? result.comments || [] : []);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSearchResults();
    }, [query, filter, sort]);
    return (
        <div className="py-2 h-(--main-height) sm:container sm:py-4 gap-3 flex  flex-col">
            <div className=" px-2  flex items-center justify-center w-full">
                <SearchBar
                    variant="large"
                    placeholder="Search posts, people, and comments..."
                    className="w-full md:ml-50  "
                    padding="md:py-6 md:px-10s"
                />
            </div>
            <div className="justify-self-start md:flex md:items-start md:ml-54  ">
                {query ? (
                    <h1 className="text-2xl font-bold py-2 sm:py-0 px-2 md:px-0 ">
                        Search results for: {query}
                    </h1>
                ) : (
                    <h1 className="text-lg text-black/60 font-bold py-2 sm:py-0 px-2 md:px-0 ">
                        Enter a search term to find posts, people, and comments
                    </h1>
                )}
            </div>

            <div className="flex flex-col overflow-hidden flex-1 h-full   md:flex-row md:gap-2 ">
                <SearchFilters activeFilter={filter} query={query} />
                <div className="flex-1 -mx-2 sm:mx-0 overflow-hidden md:ml-50">
                    {query && <SearchSort activeSort={sort} />}
                    <div className="p-2 mt-1 flex-1  bg-muted rounded-lg sm:bg-none md:ml-1 h-full scrollbar-thin overflow-auto ">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : !query ? (
                            <>
                                {posts.length > 0 && (
                                    <div className="rounded-lg sm:bg-none -mx-2 sm:mx-0">
                                        <div className="flex flex-col items-center gap-2 bg-none sm:gap-2 ">
                                            {posts.map((post) => {
                                                return (
                                                    <PostItem
                                                        post={post}
                                                        key={post.id}
                                                        containerCn="sm:!w-full sm:mx-auto"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            hasSearched && (
                                <>
                                    {filter === "posts" && (
                                        <>
                                            {posts.length > 0 ? (
                                                <div className=" rounded-lg sm:bg-none -mx-2 sm:mx-0">
                                                    <div className="flex flex-col items-center gap-2 bg-none sm:gap-2 ">
                                                        {posts.map((post) => {
                                                            return (
                                                                <PostItem
                                                                    post={post}
                                                                    key={
                                                                        post.id
                                                                    }
                                                                    containerCn="sm:!w-full sm:mx-auto"
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className=" text-center text-muted-foreground">
                                                    <p>
                                                        No posts found matching
                                                        &quot;{query}&quot;
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {filter === "people" && (
                                        <>
                                            {people.length > 0 ? (
                                                <div className="space-y-4">
                                                    {people.map((person) => (
                                                        <PersonItem
                                                            key={person.id}
                                                            person={person}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className=" text-center text-muted-foreground">
                                                    <p>
                                                        No people found matching
                                                        &quot;{query}&quot;
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {filter === "comments" && (
                                        <>
                                            {comments.length > 0 ? (
                                                <div className="space-y-4">
                                                    {comments.map((comment) => (
                                                        <CommentItem
                                                            key={comment.id}
                                                            comment={comment}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center text-muted-foreground">
                                                    <p>
                                                        No comments found
                                                        matching &quot;{query}
                                                        &quot;
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
