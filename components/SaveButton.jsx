import { useState } from "react";
import { savePost, unsavePost } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { doc, getDoc } from "firebase/firestore";

export default function SaveButton({ postRef, slug }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const savedRef = doc(firestore, `users/${uid}/saved/${slug}`);
      const snapshot = await getDoc(savedRef);
      setSaved(snapshot.exists());
    };

    checkSavedStatus();
  }, []);

  const handleSaveToggle = async () => {
    try {
      if (saved) {
        await unsavePost(auth.currentUser.uid, slug);
      } else {
        await savePost(auth.currentUser.uid, slug, postRef.path);
      }
      setSaved(!saved);
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={handleSaveToggle}>
          <BookmarkIcon className={`h-4 w-4 ${saved ? "fill-black" : ""}`} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{saved ? "Saved" : "Save"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
