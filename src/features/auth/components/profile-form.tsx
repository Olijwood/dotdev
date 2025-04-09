"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfileSettings } from "@/features/auth/server/actions";
import { clearPasswordFields } from "@/features/auth/utils/form";
import { useProfileImageUpload } from "@/hooks";
import { SettingsProfileSchema, SettingsProfileFormValues } from "@/schemas";
import { FormStatus } from "@/types";
import { FormError, FormSuccess } from "../../../components/ui/form";

export type ProfileUser = {
    id?: string;
    name?: string;
    username?: string | null;
    email?: string | null;
    isTwoFactorEnabled?: boolean;
    image?: string | null;
    bio?: string | null;
    displayEmailOnProfile?: boolean;
    location?: string | null;
    website?: string | null;
    githubUrl?: string | null;
    work?: string | null;
    education?: string | null;
    brandColour?: string | null;
    pronouns?: string | null;
    currentlyLearning?: string | null;
    currentlyHackingOn?: string | null;
    availableFor?: string | null;
    skillsLanguages?: string | null;
};

type ProfileFormProps = {
    user: ProfileUser;
};

export const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
    const [status, setStatus] = useState<FormStatus>({ state: "idle" });
    const form = useForm<SettingsProfileFormValues>({
        resolver: zodResolver(SettingsProfileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            image: user?.image || "",
            displayEmailOnProfile: false,
            username: user?.username || "",
            website: user?.website || "",
            githubUrl: user?.githubUrl || "",
            location: user?.location || "",
            bio: user?.bio || "",
            currentlyLearning: user?.currentlyLearning || "",
            availableFor: user?.availableFor || "",
            skillsLanguages: user?.skillsLanguages || "",
            currentlyHackingOn: user?.currentlyHackingOn || "",
            work: user?.work || "",
            education: user?.education || "",
            brandColour: user?.brandColour || "#000000",
            pronouns: user?.pronouns || "",
        },
        mode: "onSubmit",
    });

    const { imageUrl, fileInputRef, handleUpload, handleRemove } =
        useProfileImageUpload();
    const { update } = useSession();
    const { register, handleSubmit, watch } = form;

    const profilePic = watch("image") || "";
    const bioValue = watch("bio") || "";
    const currentlyLearningValue = watch("currentlyLearning") || "";
    const availableForValue = watch("availableFor") || "";
    const skillsLanguagesValue = watch("skillsLanguages") || "";
    const currentlyHackingOnValue = watch("currentlyHackingOn") || "";
    const pronounsValue = watch("pronouns") || "";
    const websiteUrlValue = watch("website") || "";
    const githubUrlValue = watch("githubUrl") || "";
    const locationValue = watch("location") || "";
    const workValue = watch("work") || "";
    const educationValue = watch("education") || "";

    const onSubmit = (values: SettingsProfileFormValues) => {
        setStatus({ state: "loading" });
        updateProfileSettings(values)
            .then(async (data) => {
                if (data.error) {
                    setStatus({ state: "error", message: data.error });
                    toast.error(data.error);
                }
                if (data.success) {
                    setStatus({ state: "success", message: data.success });
                    toast.success(data.success);
                    await update();
                    clearPasswordFields(form);
                }
            })
            .catch(() => {
                setStatus({ state: "error", message: "Something went wrong" });
                clearPasswordFields(form);
            });
    };

    const handleProfileImageUpload = async () => {
        const url = await handleUpload();
        if (url) {
            form.setValue("image", url);
        }
    };

    const isLoading = status.state === "loading";
    const isSuccess = status.state === "success";
    const isError = status.state === "error";

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* User Section */}
            <div className="bg-white p-6 rounded-md mb-6">
                <h2 className="text-2xl font-bold mb-6">User</h2>

                <div className="space-y-6">
                    {profilePic ? (
                        <div className="relative w-[40%] mx-auto">
                            <img
                                src={
                                    imageUrl ||
                                    `${profilePic}?t=${Date.now()}` ||
                                    `/uploads/${user.id}/profile-pic.png?t=${Date.now()}` ||
                                    ""
                                }
                                alt="Profile Pic"
                                width={48}
                                height={48}
                                className="w-full h-full object-cover border-3 border-gray-300 rounded-full"
                            />

                            <button
                                type="button"
                                className="absolute -right-2 -top-2 rounded-full bg-white p-1 "
                                onClick={handleRemove}
                            >
                                <XCircle className="size-4 text-red-500" />
                            </button>
                        </div>
                    ) : (
                        <span>{user.name?.charAt(0).toUpperCase() || "A"}</span>
                    )}
                    <div className="flex w-full mt-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleProfileImageUpload}
                            accept="image/png, image/jpeg, image/gif"
                        />
                        <button
                            className="py-2 px-2 mx-auto text-sm border-3 border-gray-300 hover:border-blue-700 hover:text-blue-900 hover:font-semibold rounded-md transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                        >
                            Edit profile image
                        </button>
                    </div>
                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <Input
                            {...register("name")}
                            className="settings-input"
                            placeholder="Jane Smith"
                        />
                    </div>

                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <Input
                            {...register("email")}
                            type="email"
                            placeholder="janesmith123@gmail.com"
                            className="settings-input"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <Checkbox
                            id="displayEmailOnProfile"
                            {...register("displayEmailOnProfile")}
                        />
                        <label htmlFor="displayEmailOnProfile" className="ml-2">
                            Display email on profile
                        </label>
                    </div>

                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <Input
                            {...register("username")}
                            className="settings-input"
                            placeholder="janesmith123"
                            required
                        />
                    </div>
                </div>
            </div>
            {/* Basic Section */}
            <div className="bg-white p-6 rounded-md mb-6">
                <h2 className="text-2xl font-bold mb-6">Basic</h2>

                <div className="space-y-6">
                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="website"
                        >
                            Website URL
                        </label>
                        <Input
                            {...register("website")}
                            placeholder="https://yoursite.com"
                            className="settings-input"
                            maxLength={100}
                        />
                        <InputCharCounter
                            charCount={websiteUrlValue.length}
                            maxChars={100}
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="githubUrl"
                        >
                            Github URL
                        </label>
                        <Input
                            {...register("githubUrl")}
                            placeholder="https://github.com/janesmith"
                            className="settings-input"
                            maxLength={100}
                        />
                        <InputCharCounter
                            charCount={githubUrlValue.length}
                            maxChars={100}
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="location"
                        >
                            Location
                        </label>
                        <Input
                            {...register("location")}
                            className="settings-input"
                            placeholder="Halifax, Nova Scotia"
                            maxLength={100}
                        />

                        <InputCharCounter
                            charCount={locationValue.length}
                            maxChars={100}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium" htmlFor="bio">
                            Bio
                        </label>
                        <Textarea
                            {...register("bio")}
                            placeholder="A short bio..."
                            className="settings-textarea"
                            maxLength={100}
                        />

                        <InputCharCounter
                            charCount={bioValue.length}
                            maxChars={100}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-md mb-6">
                <h2 className="text-2xl font-bold mb-6">Coding</h2>
                <div className="space-y-6">
                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="currentlyLearning"
                        >
                            Currently learning
                        </label>
                        <p className="text-gray-600 mb-2">
                            What are you learning right now? What are the new
                            tools and languages you&apos;re picking up right
                            now?
                        </p>
                        <Textarea
                            {...register("currentlyLearning")}
                            className="settings-textarea"
                            maxLength={200}
                        />
                        <InputCharCounter
                            charCount={currentlyLearningValue.length}
                            maxChars={200}
                        />
                    </div>

                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="availableFor"
                        >
                            Available for
                        </label>
                        <p className="text-gray-600 mb-2">
                            What kinds of collaborations or discussions are you
                            available for? What&apos;s a good reason to say Hey!
                            to you these days?
                        </p>
                        <Textarea
                            {...register("availableFor")}
                            className="settings-textarea"
                            maxLength={200}
                        />
                        <InputCharCounter
                            charCount={availableForValue.length}
                            maxChars={200}
                        />
                    </div>

                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="skillsLanguages"
                        >
                            Skills/Languages
                        </label>
                        <p className="text-gray-600 mb-2">
                            What tools and languages are you most experienced
                            with? Are you specialized or more of a generalist?
                        </p>
                        <Textarea
                            {...register("skillsLanguages")}
                            placeholder="Any languages, frameworks, etc. to highlight?"
                            className="settings-textarea"
                            maxLength={200}
                        />
                        <InputCharCounter
                            charCount={skillsLanguagesValue.length}
                            maxChars={200}
                        />
                    </div>

                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="currentlyHackingOn"
                        >
                            Currently hacking on
                        </label>
                        <p className="text-gray-600 mb-2">
                            What projects are currently occupying most of your
                            time?
                        </p>
                        <Textarea
                            {...register("currentlyHackingOn")}
                            className="settings-textarea"
                            maxLength={200}
                        />
                        <InputCharCounter
                            charCount={currentlyHackingOnValue.length}
                            maxChars={200}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-md mb-6">
                <h2 className="text-2xl font-bold mb-6">Personal</h2>

                <div className="space-y-6">
                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="pronouns"
                        >
                            Pronouns
                        </label>
                        <Input
                            {...register("pronouns")}
                            className="settings-input"
                            maxLength={200}
                        />
                        <InputCharCounter
                            charCount={pronounsValue.length}
                            maxChars={200}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-md mb-6">
                <h2 className="text-2xl font-bold mb-6">Work</h2>

                <div className="space-y-6">
                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="work"
                        >
                            Work
                        </label>
                        <Input
                            {...register("work")}
                            placeholder="What do you do? Example: CEO at ACME Inc."
                            className="settings-input"
                            maxLength={100}
                        />
                        <InputCharCounter
                            charCount={workValue.length}
                            maxChars={100}
                        />
                    </div>

                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="education"
                        >
                            Education
                        </label>
                        <Input
                            {...register("education")}
                            placeholder="Where did you go to school?"
                            className="settings-input"
                            maxLength={100}
                        />
                        <InputCharCounter
                            charCount={educationValue.length}
                            maxChars={200}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-md mb-6">
                <h2 className="text-2xl font-bold mb-6">Branding</h2>

                <div className="space-y-6">
                    <div>
                        <label
                            className="block mb-2 font-medium"
                            htmlFor="brandColor"
                        >
                            Brand color
                        </label>
                        <p className="text-gray-600 mb-2">
                            Used for backgrounds, borders etc.
                        </p>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-10 h-10 rounded-md border"
                                style={{
                                    backgroundColor:
                                        watch("brandColour") || "#000000",
                                }}
                            ></div>
                            <Input
                                {...register("brandColour")}
                                className="settings-input"
                                maxLength={7}
                            />
                        </div>
                    </div>
                </div>
            </div>{" "}
            {isSuccess && <FormSuccess message={status.message} />}
            {isError && <FormError message={status.message} />}
            <div className="mb-6">
                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-md font-medium"
                    disabled={isLoading}
                >
                    Save Profile Information
                </Button>
            </div>
        </form>
    );
};

type InputCharCounterProps = {
    charCount: number;
    maxChars: number;
};

export const InputCharCounter: FC<InputCharCounterProps> = ({
    charCount,
    maxChars,
}) => {
    return (
        <div className="text-right text-sm text-gray-500 mt-1">
            {charCount}/{maxChars}
        </div>
    );
};
