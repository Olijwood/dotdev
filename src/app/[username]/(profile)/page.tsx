"use server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
    ProfileHeader,
    ProfileHeaderSkeleton,
} from "@/features/auth/components/profile-header";
import {
    ProfileInfo,
    ProfileInfoSkelton,
} from "@/features/auth/components/profile-info";
import { getUserProfileInfoByUsername } from "@/features/auth/server/db/data";
import {
    PostFeedWrapper,
    EmptyState,
    PostFeed,
    SkeletonPostList,
} from "@/features/posts/components/list-view";
import { currentUserId } from "@/server/actions/auth";

export default async function UserPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    if (!username) {
        return notFound();
    }

    return (
        <Suspense fallback={<UserPageSkeleton />}>
            <UserPageComponent username={username} />
        </Suspense>
    );
}

const UserPageComponent = async ({ username }: { username: string }) => {
    const user = await getUserProfileInfoByUsername(username);

    if (!user || !user.id || !user.username) {
        return notFound();
    }

    const currUid = await currentUserId();

    const profileHeaderUserProps = {
        currUid,
        id: user.id,
        name: user.name,
        username: user.username,
        profileImage: user.image,
        bio: user.bio,
        location: user.location,
        joinedAt: user.createdAt,
        email: user.email,
        displayEmailOnProfile: user.displayEmailOnProfile,
        website: user.website,
        githubUrl: user.githubUrl,
        work: user.work,
        brandColour: user.brandColour,
    };

    const profileInfoUserProps = {
        username,
        skillsLanguages: user.skillsLanguages,
        currentlyLearning: user.currentlyLearning,
        currentlyHackingOn: user.currentlyHackingOn,
        availableFor: user.availableFor,
        postCount: user.postCount,
        tagFollowCount: user.tagFollowCount,
        commentCount: user.commentCount,
    };

    const emptyState = (
        <EmptyState
            heading="Nothing to see"
            paragraph={`Check back later to check if ${username} has written anything!`}
        />
    );

    return (
        <>
            <ProfileHeader user={profileHeaderUserProps} />
            <div className="max-w-7xl mx-auto md:px-4">
                <div className="md:grid md:grid-cols-[300px_1fr] md:gap-2">
                    <ProfileInfo user={profileInfoUserProps} />
                    <PostFeedWrapper
                        hidden
                        showEndMessage={false}
                        className="!px-0 sm:!px-1"
                    >
                        <PostFeed
                            filters={{ byUserId: user.id }}
                            emptyState={emptyState}
                            orderBy="latest"
                            className="max-w-full mx-0"
                        />
                        <p className="text-center text-gray-600">
                            You have reached the end!
                        </p>
                    </PostFeedWrapper>
                </div>
            </div>
        </>
    );
};

const UserPageSkeleton = () => {
    return (
        <>
            <ProfileHeaderSkeleton />
            <div className="max-w-7xl mx-auto md:px-4">
                <div className="md:grid md:grid-cols-[300px_1fr] md:gap-2">
                    <ProfileInfoSkelton />
                    <PostFeedWrapper
                        hidden
                        showEndMessage={false}
                        className="!px-0 sm:!px-1"
                    >
                        <SkeletonPostList />
                    </PostFeedWrapper>
                </div>
            </div>
        </>
    );
};
