import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      // Reference to the user's document in Firestore
      const ref = doc(firestore, "users", user.uid);
      // Listen for realtime updates
      unsubscribe = onSnapshot(ref, (docSnapshot) => {
        setUsername(docSnapshot.data()?.username || null);
      });
    } else {
      setUsername(null);
    }
    return unsubscribe;
  }, [user]);

  return { user, username };
}
