import UserProfile from "@/components/UserProfile";
import PostFeed from "@/components/PostFeed";
import { firestore, getUserWithUsername, postToJSON } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

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
    const postsQuery = query(
      collection(firestore, "posts"),
      where("username", "==", username),
      where("published", "==", true),
      orderBy("createdAt", "desc")
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
