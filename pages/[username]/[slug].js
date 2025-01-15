import styles from "@/styles/Post.module.css";
import PostContent from "@/components/PostContent";
import { firestore, getUserWithUsername, postToJSON } from "@/lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import PostActions from "@/components/PostActions";
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

  return (
    <main className="styles.container">
      <div className="mt-0">
        <div className="rounded-lg border bg-card">
          <PostActions postUid={post.uid} slug={post.slug} commentCount={0} />
        </div>
      </div>
      <section>
        <PostContent post={post} />
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
