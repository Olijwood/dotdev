"use server";

import { Suspense } from "react";
import { OnboardingFormSkeleton } from "@/components/onboarding";

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#171f5d] flex items-center justify-center">
            <Suspense fallback={<OnboardingFormSkeleton />}>
                {children}
            </Suspense>
        </div>
    );
}
