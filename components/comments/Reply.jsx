import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

export default function Reply({ reply }) {
  console.log("Reply", reply);
  return (
    <div className="flex items-start gap-4">
      <Avatar className="w-8 h-8">
        <Image
          src={reply.user.photoURL || "/hacker.png"}
          width={100}
          height={100}
        />
        <AvatarFallback>{reply.user?.displayName[0] || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{reply.user?.displayName}</span>
          <span className="text-sm text-muted-foreground">
            {`${new Date(reply.createdAt?.seconds * 1000).toLocaleTimeString(
              "default",
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              }
            )} ${new Date(reply.createdAt?.toDate()).toLocaleDateString(
              "en-US",
              {
                day: "numeric",
                month: "2-digit",
                year: "2-digit",
              }
            )}
            `}
          </span>
        </div>
        <p className="text-sm">{reply.content}</p>
      </div>
    </div>
  );
}
