import { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore, postToJSON } from "@/lib/firebase";
import { isEqual } from "lodash";

const CommentsContext = createContext();

export function CommentsProvider({ postPath, children }) {
  const [comments, setComments] = useState(new Map());

  useEffect(() => {
    const commentsRef = query(
      collection(firestore, `${postPath}/comments`),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const updatedComments = new Map();
      snapshot.docs.forEach((doc) => {
        updatedComments.set(doc.id, { id: doc.id, ...postToJSON(doc) });
      });

      setComments((prev) => {
        if (
          !isEqual(
            Array.from(prev.values()),
            Array.from(updatedComments.values())
          )
        ) {
          return updatedComments;
        }
        return prev;
      });
    });
    return unsubscribe;
  }, [postPath]);

  return (
    <CommentsContext.Provider value={comments}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  return useContext(CommentsContext);
}
