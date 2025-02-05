import styles from "@/styles/Home.module.css";

import Loader from "@/components/Loader";
import PostFeed from "@/components/PostFeed";
import { firestore, postToJSON, fromMillis } from "@/lib/firebase";
import {
    collection,
    where,
    orderBy,
    query,
    limit,
    getDocs,
    startAfter,
} from "firebase/firestore";
import { useState } from "react";

// Max post to query per page
const LIMIT = 8;

export async function getServerSideProps(context) {
    const postsQuery = query(
        collection(firestore, "posts"),
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        limit(LIMIT)
    );
    const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    return {
        props: { posts },
    };
}

export default function Home(props) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);

    const [postsEnd, setPostsEnd] = useState(false);

    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const cursor =
            typeof last.createdAt === "number"
                ? fromMillis(last.createdAt)
                : last.createdAt;

        const postsQuery = query(
            collection(firestore, "posts"),
            where("published", "==", true),
            orderBy("createdAt", "desc"),
            startAfter(cursor),
            limit(LIMIT)
        );

        const newPosts = (await getDocs(postsQuery)).docs.map((doc) =>
            doc.data()
        );
        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    };

    return (
        <main className="flex flex-col items-center self-center ">
            <PostFeed posts={posts} />

            {!loading && !postsEnd && (
                <button
                    onClick={getMorePosts}
                    className="mt-4 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
                >
                    Load More
                </button>
            )}

            <Loader show={loading} />

            {postsEnd && (
                <p className="mt-4 text-gray-600 font-medium">
                    You have reached the end!
                </p>
            )}
        </main>
    );
}
