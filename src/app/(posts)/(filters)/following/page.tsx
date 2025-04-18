import { Main } from "@/components/ui/main";
import {
    PostFeed,
    PostFeedWrapper,
} from "@/features/posts/components/list-view";

export default async function FollowingPostsPage({}) {
    return (
        <Main className="scrollbar-y justify-start ">
            <PostFeedWrapper page="following" isDropdown={false}>
                <PostFeed filters={{ isFollowing: true }} />
            </PostFeedWrapper>
        </Main>
    );
}
