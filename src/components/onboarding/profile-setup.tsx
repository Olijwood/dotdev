"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";

type ProfileSetupProps = {
    profile: {
        username: string;
        bio: string;
        profileImage: string;
        displayName: string;
    };
    setProfile: (profile: {
        username: string;
        bio: string;
        profileImage: string;
        displayName: string;
    }) => void;
};

export function ProfileSetup({ profile, setProfile }: ProfileSetupProps) {
    const [charCount, setCharCount] = useState(0);
    const maxBioLength = 200;

    const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (text.length <= maxBioLength) {
            setProfile({ ...profile, bio: text });
            setCharCount(text.length);
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, username: e.target.value });
    };

    // In a real app, this would handle file uploads
    const handleImageEdit = () => {
        // Placeholder for image upload functionality
        alert("Image upload would be implemented here");
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
                    {profile.profileImage ? (
                        <Image
                            src={profile.profileImage || "/placeholder.svg"}
                            alt="Profile"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span>
                            {profile.displayName.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-xl mb-2">{profile.displayName}</p>
                    <button
                        className="py-2 px-3 text-sm bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-md transition-colors"
                        onClick={handleImageEdit}
                    >
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
                        value={profile.username}
                        onChange={handleUsernameChange}
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
                            value={profile.bio}
                            onChange={handleBioChange}
                        />
                        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                            {charCount}/{maxBioLength}
                        </div>
                    </div>
                </div>
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
                            0/maxBioLength
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
