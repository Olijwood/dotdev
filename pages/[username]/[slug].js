import styles from "@/styles/Post.module.css";
import PostContent from "@/components/PostContent";
import {
  auth,
  firestore,
  getUserWithUsername,
  postToJSON,
} from "@/lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import PostToolbar from "@/components/PostToolbar";
import { CommentsSection } from "@/components/comments-section";
import { mockComments } from "@/components/mock-comments";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(firestore, `users/${userDoc.id}/posts/${slug}`);
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
  const user = auth.currentUser;
  return (
    <main className="styles.container">
      {/* <PostDetailActions postUid={post.uid} slug={post.slug} commentCount={0} /> */}
      <PostToolbar post={post} postRef={postRef} isAuthor={isAuthor} />
      <section>
        <PostContent post={post} />
      </section>
      <section className="mt-4">
        <div className="card">
          <CommentsSection initialComments={mockComments} user={user} />
        </div>
      </section>
    </main>
  );
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(firestore, "posts"));
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
