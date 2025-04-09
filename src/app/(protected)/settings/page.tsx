"use server";

import { redirect } from "next/navigation";
import {
    ProfileForm,
    ProfileUser,
} from "@/features/auth/components/profile-form";
import { currentUserId } from "@/server/actions/auth";
import { getUserById } from "@/server/db/user";

export default async function SettingsPage() {
    const cUserId = await currentUserId();

    if (!cUserId) {
        return redirect("/");
    }

    const dbUser = await getUserById(cUserId);

    const user: ProfileUser = {
        id: dbUser?.id,
        name: dbUser?.name,
        username: dbUser?.username,
        email: dbUser?.email,
        isTwoFactorEnabled: dbUser?.isTwoFactorEnabled,
        image: dbUser?.image,
        bio: dbUser?.bio,
        displayEmailOnProfile: dbUser?.displayEmailOnProfile,
        location: dbUser?.location,
        website: dbUser?.website,
        work: dbUser?.work,
        education: dbUser?.education,
        brandColour: dbUser?.brandColour,
        pronouns: dbUser?.pronouns,
        currentlyLearning: dbUser?.currentlyLearning,
        currentlyHackingOn: dbUser?.currentlyHackingOn,
        availableFor: dbUser?.availableFor,
        skillsLanguages: dbUser?.skillsLanguages,
        githubUrl: dbUser?.githubUrl,
    };

    return (
        <>
            <div className=" px-4 pb-4 text-2xl font-bold text-blue-600">
                @olijwood
            </div>

            <div className="pb-2">
                <ProfileForm user={user} />
            </div>
        </>
    );
}
