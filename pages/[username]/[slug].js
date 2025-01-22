import styles from "@/styles/Post.module.css";
import PostContent from "@/components/PostContent";
import {
  auth,
  firestore,
  getUserWithUsername,
  postToJSON,
} from "@/lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import PostToolbar from "@/components/PostToolbar";
import CommentsSection from "@/components/comments/CommentsSection";
import { CommentsProvider } from "@/lib/commentsContext";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(firestore, "posts", slug);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }
  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export default function Post(props) {
  const postRef = doc(firestore, props.path);
  const [realTimePost] = useDocumentData(postRef);

  const post = realTimePost || props.post;
  const isAuthor = auth.currentUser?.uid === post.uid;
  return (
    <main className="styles.container">
      <PostToolbar post={post} postRef={postRef} isAuthor={isAuthor} />
      <section>
        <PostContent post={post} />
      </section>
      <section className="mt-4">
        <div className="card">
          <CommentsProvider postPath={postRef.path}>
            <CommentsSection postPath={postRef.path} />
          </CommentsProvider>
        </div>
      </section>
    </main>
  );
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collection(firestore, "posts"));
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });
  return {
    paths,
    fallback: "blocking",
  };
}
