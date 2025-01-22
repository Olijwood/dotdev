import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import PostFeed from "@/components/PostFeed";
import { auth } from "@/lib/firebase";
import Loader from "@/components/Loader";
import { fetchSavedPosts } from "@/lib/firestoreUtils";
import { UserContext } from "@/lib/context";

export default function UserReadingListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const fetchedPosts = await fetchSavedPosts(user.uid);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  return (
    <main>
      <h1>Your Reading List</h1>
      {loading ? (
        <Loader show={loading} />
      ) : posts.length > 0 ? (
        <PostFeed posts={posts} />
      ) : (
        <>
          <p>You have no saved posts</p>
          <Link href="/">Go to Home</Link>
        </>
      )}
    </main>
  );
}
