"use client";

import { XCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useProfileImageUpload } from "@/hooks";
import { ValidatedInput } from "../ui/input/validated-input";
import { ValidatedTextarea } from "../ui/textarea";
import { useValidateUsername } from "./hooks";

import type { UserProfileDetails } from "./types";

type ProfileSetupProps = {
    profile: UserProfileDetails;
    onUploadSuccess: (url: string) => void;
};

export function ProfileSetup({ profile, onUploadSuccess }: ProfileSetupProps) {
    const { imageUrl, fileInputRef, handleUpload, handleRemove } =
        useProfileImageUpload();
    const { watch } = useFormContext();
    const username = watch("username");
    const profilePic = watch("profileImage");

    const { isValid, validUsernameMsg } = useValidateUsername(
        username,
        profile.username,
    );

    const handleProfileImageUpload = async () => {
        const url = await handleUpload();
        if (url) onUploadSuccess(url);
    };

    return (
        <div className="p-6 sm:p-12">
            <div className="space-y-4 mb-8">
                <h1 className="text-[3rem] font-black text-[#090909] leading-tight">
                    Build your profile
                </h1>
                <p className="text-[#404040] text-xl leading-relaxed">
                    Tell us a little bit about yourself — this is how others
                    will see you on DEV Community. You&apos;ll always be able to
                    edit this later in your Settings.
                </p>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-24 h-24 rounded-full bg-[#3b49df] flex items-center justify-center text-white text-4xl overflow-hidden">
                    {profilePic ? (
                        <div className="relative">
                            <img
                                src={
                                    imageUrl ||
                                    profilePic ||
                                    `/uploads/${profile.id}/profile-pic.png` ||
                                    ""
                                }
                                alt="Profile Pic"
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />

                            <button
                                type="button"
                                className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-md"
                                onClick={handleRemove}
                            >
                                <XCircle className="size-4 text-red-500" />
                            </button>
                        </div>
                    ) : (
                        <span>
                            {profile.displayName.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-xl mb-2">{profile.displayName}</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleProfileImageUpload}
                        accept="image/png, image/jpeg, image/gif"
                    />
                    <button
                        className="py-2 px-3 text-sm bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-md transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                    >
                        Edit profile image
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <ValidatedInput
                    name="username"
                    label="Username"
                    placeholder="username"
                    externalError={!isValid ? validUsernameMsg : undefined}
                />
                <ValidatedTextarea
                    name="bio"
                    label="Bio"
                    maxLength={200}
                    placeholder="Tell us a little about yourself"
                />
            </div>
        </div>
    );
}

export function ProfileSetupSkeleton() {
    return (
        <div className="p-6 sm:p-12">
            <div className="space-y-4 mb-8">
                <h1 className="text-[3rem] font-black text-[#090909] leading-tight">
                    Build your profile
                </h1>
                <p className="text-[#404040] text-xl leading-relaxed">
                    Tell us a little bit about yourself — this is how others
                    will see you on DEV Community. You&apos;ll always be able to
                    edit this later in your Settings.
                </p>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-24 h-24 rounded-full bg-[#3b49df] flex items-center justify-center text-white text-4xl overflow-hidden"></div>
                <div>
                    <p className="text-xl mb-2 text-transparent">abc</p>
                    <button className="py-2 px-3 text-sm bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-md transition-colors">
                        Edit profile image
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label
                        htmlFor="username"
                        className="block text-[#090909] font-medium"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        className="w-full border border-gray-300 focus:ring-[#3b49df] focus:ring-2 focus:outline-none rounded-md p-2"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="bio"
                        className="block text-[#090909] font-medium"
                    >
                        Bio
                    </label>
                    <div className="relative">
                        <textarea
                            id="bio"
                            placeholder="Tell us a little about yourself"
                            className="w-full min-h-[100px] resize-none border border-gray-300 focus:ring-[#3b49df] focus:ring-2  focus:outline-none rounded-md p-2"
                        />
                        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                            0/200
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
