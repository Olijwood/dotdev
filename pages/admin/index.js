import styles from "../../styles/Admin.module.css";
import AuthCheck from "@/components/AuthCheck";
import Metatags from "@/components/Metatags";
import { UserContext } from "@/lib/context";
import { firestore, auth } from "@/lib/firebase";

import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import PostFeed from "@/components/PostFeed";

export default function AdminPostsPage({}) {
  return (
    <main>
      <Metatags title="Admin Posts" description="Admin Posts" />
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = collection(firestore, "users", auth.currentUser.uid, "posts");
  const postsQuery = query(ref, orderBy("createdAt"));
  const [querySnapshot] = useCollection(postsQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // validate length
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(firestore, `users/${uid}/posts/${slug}`);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
      reactions: {
        heart: 0,
        clap: 0,
        fire: 0,
        "thumbs up": 0,
      },
    };

    await setDoc(ref, data);

    toast.success("Post Created!");

    router.push(`admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Article Title"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
