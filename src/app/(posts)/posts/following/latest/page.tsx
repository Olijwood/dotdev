import { Main } from "@/components/ui/main";
import {
    PostFeed,
    PostFeedWrapper,
} from "@/features/posts/components/list-view";
import { currentUserId } from "@/server/actions/auth";

export default async function FollowingPostsPage({}) {
    const userId = await currentUserId();
    return (
        <Main className="scrollbar-y justify-start ">
            <PostFeedWrapper page="posts/following" isDropdown={false}>
                <PostFeed
                    where={
                        userId
                            ? {
                                  user: {
                                      followers: {
                                          some: {
                                              followerId: userId,
                                          },
                                      },
                                  },
                              }
                            : {}
                    }
                />
            </PostFeedWrapper>
        </Main>
    );
}
