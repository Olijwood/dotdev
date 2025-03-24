"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import {
    ProfileSetup,
    ProfileSetupSkeleton,
    SuggestedFollows,
    TagSelection,
} from "@/components/onboarding";
import { StepIndicator } from "@/components/ui/step-indicator";
import { cn } from "@/lib/utils";
import { completeOnboarding } from "@/server/actions/onboarding";
import { Person, Tag, UserProfileDetails } from "./types";

type OnboardingFormProps = {
    userProfile: UserProfileDetails;
    availableTags: Tag[] | [];
    suggestedPeople: Person[] | [];
};

export function OnboardingForm({
    userProfile,
    availableTags,
    suggestedPeople,
}: OnboardingFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [profile, setProfile] = useState({
        username: userProfile.username,
        bio: userProfile.bio,
        profileImage: userProfile.profileImage,
        displayName: userProfile.displayName,
    });
    const [followedUsers, setFollowedUsers] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const totalSteps = 3;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = async () => {
        try {
            await completeOnboarding({
                profile,
                followedUserIds: followedUsers,
                selectedTagIds: selectedTags,
            });
            window.location.href = "/";
        } catch (err) {
            console.error("Onboarding failed:", err);
        }
    };

    const skipForNow = currentStep === 2 && followedUsers.length === 0;
    return (
        <div className="bg-white w-full max-w-3xl flex flex-col h-[calc(100vh-2rem)] max-h-[800px] relative overflow-hidden sm:rounded-lg sm:shadow-lg ">
            <div className="flex-grow overflow-auto scrollbar-thin">
                {currentStep === 1 && (
                    <ProfileSetup profile={profile} setProfile={setProfile} />
                )}
                {currentStep === 2 && (
                    <SuggestedFollows
                        suggestedPeople={suggestedPeople}
                        followedUsers={followedUsers}
                        setFollowedUsers={setFollowedUsers}
                    />
                )}
                {currentStep === 3 && (
                    <TagSelection
                        availableTags={availableTags}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                    />
                )}
            </div>
            <div className="flex items-center p-8 border-t relative">
                <div className="absolute left-4">
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                    )}
                </div>
                <div className="mx-auto">
                    <StepIndicator
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                    />
                </div>
                <div className="absolute right-4">
                    {currentStep === 3 ? (
                        <button
                            onClick={handleFinish}
                            className="bg-[#3b49df] hover:bg-[#2f3ab2] text-white py-2 px-4 rounded-md"
                        >
                            Finished
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className={cn(
                                "bg-[#3b49df] hover:bg-[#2f3ab2] text-white py-2 px-4 rounded-md",
                                skipForNow
                                    ? "!bg-transparent !text-gray-700 !ring-2 !ring-gray-400  font-semibold hover:!bg-gray-100"
                                    : "",
                            )}
                        >
                            {skipForNow ? "Skip" : "Continue"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function OnboardingFormSkeleton() {
    const totalSteps = 3;

    return (
        <div className="bg-white w-full max-w-3xl flex flex-col h-[calc(100vh-2rem)] max-h-[800px] relative overflow-hidden sm:rounded-lg sm:shadow-lg ">
            <div className="flex-grow overflow-auto scrollbar-thin">
                <ProfileSetupSkeleton />
            </div>
            <div className="flex items-center p-8 border-t relative">
                <div className="mx-auto">
                    <StepIndicator currentStep={1} totalSteps={totalSteps} />
                </div>
                <div className="absolute right-4">
                    <button className="bg-[#3b49df] hover:bg-[#2f3ab2] text-white py-2 px-4 rounded-md">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
