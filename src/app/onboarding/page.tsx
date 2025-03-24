import { OnboardingForm } from "@/components/onboarding";
import { getOnboardingAvailableTags } from "@/features/posts/server/db/tags";
import { delay } from "@/lib/utils";
import {
    currentOnboardingProfileDetails,
    currentUserId,
} from "@/server/actions/auth";
import { getOnboardingSuggestedPeople } from "@/server/db/user";

export default async function OnboardingPage() {
    const userId = await currentUserId();
    if (!userId) return null;
    const userProfileDetails = await currentOnboardingProfileDetails(userId);
    if (!userProfileDetails) return null;
    const availableTags = await getOnboardingAvailableTags();
    const suggestedPeople = await getOnboardingSuggestedPeople(userId);

    await delay(3000);
    return (
        <OnboardingForm
            userProfile={userProfileDetails}
            availableTags={availableTags}
            suggestedPeople={suggestedPeople}
        />
    );
}
