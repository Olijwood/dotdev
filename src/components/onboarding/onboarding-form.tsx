"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import {
    ProfileSetup,
    ProfileSetupSkeleton,
    SuggestedFollows,
    TagSelection,
} from "@/components/onboarding";
import { StepIndicator } from "@/components/ui/step-indicator";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { cn } from "@/lib/utils";
import { completeOnboarding } from "@/server/actions/onboarding";
import { OnboardingSchema, OnboardingFormValues } from "./schema";
import { Person, Tag, UserProfileDetails } from "./types";

const totalSteps = 3;
type OnboardingFormProps = {
    userProfile: UserProfileDetails & {
        followedUserIds?: string[];
        selectedTagIds?: string[];
    };
    availableTags: Tag[] | [];
    suggestedPeople: Person[] | [];
};

export function OnboardingForm({
    userProfile,
    availableTags,
    suggestedPeople,
}: OnboardingFormProps) {
    const { step, setStep, handleNext, handleBack } =
        useMultiStepForm(totalSteps);

    const form = useForm<OnboardingFormValues>({
        resolver: zodResolver(OnboardingSchema),
        defaultValues: {
            username: userProfile.username,
            bio: userProfile.bio || "",
            profileImage: userProfile.profileImage || "",
            followedUserIds: userProfile.followedUserIds || [],
            selectedTagIds: userProfile.selectedTagIds || [],
        },
        mode: "onSubmit",
    });

    const { handleSubmit } = form;

    const tagIds = form.watch("selectedTagIds") || [];

    const handleSubmitWithValidation = handleSubmit(
        async (data) => {
            if (step !== totalSteps) {
                return;
            }
            try {
                console.log("data", data);
                await completeOnboarding(data);
                toast.success("Welcome!");
                window.location.href = "/";
            } catch (error) {
                console.error("something went wrong", error);
            }
        },
        (errors) => {
            if (errors.username || errors.bio) {
                setStep(1);
                toast.error("Please fix the errors in your profile.");
            }
        },
    );

    const handleProfileImageSuccess = (imageUrl: string) => {
        form.setValue("profileImage", imageUrl);
    };

    const skipForNow = step === 2 && tagIds.length === 0;

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmitWithValidation}
                className="bg-white w-full max-w-3xl flex flex-col h-[calc(100vh-2rem)] max-h-[800px] relative overflow-hidden sm:rounded-lg sm:shadow-lg "
            >
                <div className="flex-grow overflow-auto scrollbar-thin">
                    {step === 1 && (
                        <ProfileSetup
                            profile={userProfile}
                            onUploadSuccess={handleProfileImageSuccess}
                        />
                    )}
                    {step === 2 && (
                        <TagSelection availableTags={availableTags} />
                    )}
                    {step === 3 && (
                        <SuggestedFollows suggestedPeople={suggestedPeople} />
                    )}
                </div>
                <div className="flex items-center p-8 border-t relative">
                    <div className="absolute left-4">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                type="button"
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                    <div className="mx-auto">
                        <StepIndicator
                            currentStep={step}
                            totalSteps={totalSteps}
                        />
                    </div>
                    <div className="absolute right-4">
                        {step !== totalSteps ? (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNext();
                                }}
                                type="button"
                                className={cn(
                                    "bg-[#3b49df] hover:bg-[#2f3ab2] text-white py-2 px-4 rounded-md",
                                    skipForNow
                                        ? "!bg-transparent !text-gray-700 !ring-2 !ring-gray-400  font-semibold hover:!bg-gray-100"
                                        : "",
                                )}
                            >
                                {skipForNow ? "Skip" : "Continue"}
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-[#3b49df] hover:bg-[#2f3ab2] text-white py-2 px-4 rounded-md"
                            >
                                Finished
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
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
