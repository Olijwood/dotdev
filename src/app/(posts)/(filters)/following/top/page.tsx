import { Main } from "@/components/ui/main";
import {
    PostFeed,
    PostFeedWrapper,
} from "@/features/posts/components/list-view";

export default function TopFollowingPostsPage() {
    return (
        <Main className="scrollbar-y justify-start">
            <PostFeedWrapper
                page="/following"
                activeSort="Top"
                isDropdown={false}
            >
                <PostFeed orderBy="top" filters={{ isFollowing: true }} />
            </PostFeedWrapper>
        </Main>
    );
}
