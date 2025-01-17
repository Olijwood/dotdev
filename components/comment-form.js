import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function CommentForm({
  onSubmit,
  placeholder = "Add to the discussion",
  user,
}) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      content,
      createdAt: new Date().toISOString(),
      user: {
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      isReply: false,
      likes: 0,
      replies: [],
    });
    setContent("");
  };
  console.log(user);
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.photoURL || "/hacker.png"} />
          <AvatarFallback>{user?.displayName[0] || "U"}</AvatarFallback>
        </Avatar>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px]"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim()}>
          Submit
        </Button>
      </div>
    </form>
  );
}
