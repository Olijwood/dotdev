import { useState, useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserContext } from "@/lib/context";
import Image from "next/image";

export default function CommentForm({ onSubmit }) {
  const [content, setContent] = useState("");
  const { user } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({ content });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <Image
            src={user?.photoURL || "/hacker.png"}
            width={100}
            height={100}
            alt={`${user?.displayName} Profile Pic`}
          />
          <AvatarFallback>{user?.displayName[0] || "U"}</AvatarFallback>
        </Avatar>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
        placeholder="Write a reply..."
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim()}>
          Submit
        </Button>
      </div>
    </form>
  );
}
