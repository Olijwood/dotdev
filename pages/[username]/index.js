import UserProfile from "@/components/UserProfile";
import PostFeed from "@/components/PostFeed";
import { getUserWithUsername, postToJSON } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export async function getServerSideProps({ query: queryParams }) {
  const { username } = queryParams;

  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }
  let user = null;
  let posts = [];

  if (userDoc) {
    user = userDoc.data();

    const postsRef = collection(userDoc.ref, "posts");

    const postsQuery = query(
      postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const postsSnapshot = await getDocs(postsQuery);
    posts = postsSnapshot.docs.map(postToJSON);
  }
  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
