import {
  doc,
  collection,
  addDoc,
  getDoc,
  increment,
  updateDoc,
  onSnapshot,
  setDoc,
  getDocs,
  orderBy,
  deleteDoc,
  serverTimestamp,
  query,
} from "firebase/firestore";
import { firestore } from "./firebase";

export function basicUserData(user) {
  if (!user) {
    console.error("no user");
    return null;
  }
  console.log(user);
  const userData = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    userId: user.uid,
  };
  console.log(userData);
  return userData;
}

export async function addComment(postPath, commentData) {
  const commentsRef = collection(firestore, `${postPath}/comments`);
  try {
    await addDoc(commentsRef, {
      ...commentData,
      repliesCount: 0,
      likes: 0,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

export async function addReply(commentPath, replyData) {
  const repliesRef = collection(firestore, `${commentPath}/replies`);
  try {
    await addDoc(repliesRef, {
      ...replyData,
      likes: 0,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding reply:", error);
  }
}

export async function fetchReplies(commentPath) {
  const repliesRef = collection(firestore, `${commentPath}/replies`);
  try {
    const repliesQuery = query(repliesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(repliesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
}

export async function toggleLike(path, userId) {
  try {
    const docRef = doc(firestore, path);
    const userLikeDocRef = doc(firestore, `${path}/likes/${userId}`);

    const userLikeDoc = await getDoc(userLikeDocRef);
    if (userLikeDoc.exists()) {
      const currentLikeStatus = userLikeDoc.data().liked;
      // Toggle the user's like status
      try {
        await updateDoc(userLikeDocRef, { liked: !currentLikeStatus });
        // Update the likes count on the comment
        await updateDoc(docRef, {
          likes: increment(currentLikeStatus ? -1 : 1),
        });
      } catch (error) {
        console.error("Error updating like status:", error);
      }
    } else {
      // If the user hasn't liked yet, add a like
      await setDoc(userLikeDocRef, { liked: true });
      await updateDoc(docRef, { likes: increment(1) });
    }
    return;
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}

export async function updateCommentCount(postPath, incrementValue, countId) {
  const postRef = doc(firestore, postPath);
  await updateDoc(postRef, {
    [countId]: increment(incrementValue),
  });
}
