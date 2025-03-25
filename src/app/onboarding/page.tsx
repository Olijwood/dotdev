"use server";

import { OnboardingForm } from "@/components/onboarding";
import { getOnboardingAvailableTags } from "@/features/posts/server/db/tags";
import {
    currentOnboardingProfileDetails,
    currentUserId,
} from "@/server/actions/auth";
import { getOnboardingSuggestedPeople } from "@/server/db/user";

export default async function OnboardingPage() {
    const userId = await currentUserId();
    if (!userId) return null;
    const profileDetails = await currentOnboardingProfileDetails(userId);
    if (!profileDetails) return null;
    const availableTags = await getOnboardingAvailableTags();
    const suggestedPeople = await getOnboardingSuggestedPeople(userId);

    const followedAvailableTagsIds = availableTags
        .filter((tag) => tag.isFollowing)
        .map((tag) => tag.id);

    const followedSuggestedPeopleIds = suggestedPeople
        .filter((person) => person.isFollowing)
        .map((person) => person.id);

    const userProfileDetails = {
        ...profileDetails,
        selectedTagIds: followedAvailableTagsIds,
        followedUserIds: followedSuggestedPeopleIds,
    };
    return (
        <OnboardingForm
            userProfile={userProfileDetails}
            availableTags={availableTags}
            suggestedPeople={suggestedPeople}
        />
    );
}
