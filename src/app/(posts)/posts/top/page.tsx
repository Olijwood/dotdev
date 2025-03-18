import { Main } from "@/components/ui/main";
import {
    PostFeed,
    PostFeedWrapper,
} from "@/features/posts/components/list-view";

export default function TopPostsPage() {
    return (
        <Main className="scrollbar-y justify-start">
            <PostFeedWrapper activeSort="Top">
                <PostFeed orderBy="top" />
            </PostFeedWrapper>
        </Main>
    );
}
