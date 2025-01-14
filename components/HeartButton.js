import { increment, doc, writeBatch } from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";

export default function HeartButton({ postRef }) {
  // Listen to heart document for currently logged in user
  const heartRef = doc(firestore, postRef.path, "hearts", auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  // Add a new heart to the post
  const addHeart = async () => {
    try {
      const uid = auth.currentUser.uid;
      const batch = writeBatch(firestore);

      // Increment heart count on the post
      batch.update(postRef, { heartCount: increment(1) });

      // Create a heart focument for the user
      batch.set(heartRef, { uid });

      await batch.commit();
    } catch (error) {
      console.log("Error adding heart: ", error);
    }
  };

  // Remove a heart from the post
  const removeHeart = async () => {
    try {
      const batch = writeBatch(firestore);

      // Decrement heart count on the post
      batch.update(postRef, { heartCount: increment(-1) });

      // Delete the user's heart document
      batch.delete(heartRef);

      await batch.commit();
    } catch (error) {
      console.log("Error removing heart: ", error);
    }
  };

  // Check if the heart document exists
  const heartExists = heartDoc?.exists();

  return heartExists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
