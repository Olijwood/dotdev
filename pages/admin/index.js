import styles from "../../styles/Admin.module.css";
import AuthCheck from "@/components/AuthCheck";
import Metatags from "@/components/Metatags";
import { UserContext } from "@/lib/context";
import { firestore } from "@/lib/firebase";

import { collection, query, orderBy, where } from "firebase/firestore";
import { useContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "@/components/PostFeed";
import CreatePost from "@/components/CreatePost";

export default function AdminPostsPage({}) {
    return (
        <main>
            <Metatags title="Admin Posts" description="Admin Posts" />
            <AuthCheck>
                <CreatePost />
                <PostList />
            </AuthCheck>
        </main>
    );
}

function PostList() {
    const { user } = useContext(UserContext);

    const postsQuery = user
        ? query(
              collection(firestore, "posts"),
              where("uid", "==", user.uid),
              orderBy("createdAt", "desc")
          )
        : null;

    const [querySnapshot, loading, error] = useCollection(postsQuery);

    if (error) {
        console.error("Error fetching posts:", error);
        return <p>Error loading posts.</p>;
    }
    const posts = querySnapshot?.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return (
        <>
            <h1 className="text-3xl text-center font-semibold mb-2">
                Manage your Posts
            </h1>
            {loading ? (
                <p>Loading posts...</p>
            ) : (
                <PostFeed posts={posts || []} isAdmin={true} />
            )}
        </>
    );
}
