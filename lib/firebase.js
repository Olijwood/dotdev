import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "rnextfire.firebaseapp.com",
  projectId: "rnextfire",
  storageBucket: "rnextfire.firebasestorage.app",
  messagingSenderId: "44776403326",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-W905PK22HM",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(app);
export const fromMillis = Timestamp.fromMillis;

export const storage = getStorage(app);

/// Helper functions

/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const userQuery = query(
    usersRef,
    where("username", "==", username),
    limit(1)
  );
  const querySnapshot = await getDocs(userQuery);
  // Get the first document from the query result
  const userDoc = querySnapshot.docs[0];

  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,

    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt?.toMillis
      ? data.createdAt.toMillis()
      : Date.now(),
    updatedAt: data?.updatedAt?.toMillis
      ? data.updatedAt.toMillis()
      : Date.now(),
  };
}
