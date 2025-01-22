import ReactionPopup from "./ReactionPopup";
import { useState, useEffect, useContext } from "react";
import {
    BookmarkIcon,
    MessageCircle,
    Heart,
    PencilIcon,
    Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getUserWithUsername,
    firestore,
    postToJSON,
    auth,
} from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
    savePost,
    unsavePost,
    checkIfPostIsSaved,
    useDeletePost,
} from "@/lib/firestoreUtils";
import { UserContext } from "@/lib/context";

export default function PostActions({
    postUid,
    slug,
    commentCount = 0,
    minutesToRead = 0,
    isAdmin = false,
}) {
    const [saved, setSaved] = useState(false);
    const postRef = doc(firestore, `posts/${slug}`);
    const { user } = useContext(UserContext);
    const isAuthor = auth.currentUser?.uid === postUid;
    const { openModal, modal } = useDeletePost();
    useEffect(() => {
        const checkIfSaved = async () => {
            if (!user) {
                return;
            }
            try {
                const isSaved = await checkIfPostIsSaved(user.uid, slug);
                setSaved(isSaved);
            } catch (error) {
                console.error("Error checking if post is saved:", error);
            }
        };
        checkIfSaved();
    }, [user, slug]);

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
        <>
            <TooltipProvider>
                <div className="flex items-center gap-2 p-2 border-t">
                    <ReactionPopup postRef={postRef} />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-sm text-muted-foreground">
                                    {commentCount}
                                </span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Comments</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="flex items-center ml-auto ">
                        {minutesToRead && !isAdmin
                            ? minutesToRead > 0 && (
                                  <span className="text-sm text-muted-foreground  ">
                                      {minutesToRead} min read
                                  </span>
                              )
                            : ""}
                        {isAdmin ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openModal(postRef)}
                                    >
                                        <Trash2Icon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : null}
                        {isAuthor ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/admin/${slug}`}>
                                        <Button variant="ghost" size="sm">
                                            <PencilIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : null}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-1"
                                    size="sm"
                                    onClick={handleSaveToggle}
                                >
                                    <BookmarkIcon
                                        className={`h-4 w-4 fill-none hover:fill-gray-900 ${
                                            saved ? "fill-black" : ""
                                        }`}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{saved ? "Saved" : "Save"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </TooltipProvider>
            {modal}
        </>
    );
}
