import { Main } from "@/components/ui/main";
import {
    PostFeed,
    PostFeedWrapper,
} from "@/features/posts/components/list-view";

export default function Home({}) {
    return (
        <Main className="scrollbar-y justify-start ">
            <PostFeedWrapper>
                <PostFeed />
            </PostFeedWrapper>
        </Main>
    );
}
