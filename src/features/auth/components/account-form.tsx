"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AccountForm() {
    return (
        <div className="space-y-6">
            {/* Account emails */}
            <div className="bg-white p-6 rounded-md">
                <h2 className="text-2xl font-bold mb-6">Account emails</h2>
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-[120px]">
                            Primary email
                        </span>
                        <span className="text-gray-700">
                            olijwood@gmail.com
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-[120px]">
                            Google email
                        </span>
                        <span className="text-gray-700">
                            olijwood@gmail.com
                        </span>
                    </div>
                </div>
            </div>

            {/* Export content */}
            <div className="bg-white p-6 rounded-md">
                <h2 className="text-2xl font-bold mb-4">Export content</h2>
                <p className="text-gray-700 mb-4">
                    You can request an export of all your content. Currently we
                    only support the export of your posts and comments, if you
                    have any. They will be emailed to your inbox.
                </p>
                <p className="font-medium mb-4">
                    Request an export of your content
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Submit Data Request
                </Button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white p-6 rounded-md">
                <h2 className="text-xl font-bold text-red-600 mb-6">
                    Danger Zone
                </h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold mb-2">
                            Remove OAuth Associations
                        </h3>
                        <p className="text-gray-700 mb-4">
                            You are unable to remove one of your authentication
                            methods as you need a remaining method to
                            authenticate you. Please add another authentication
                            method above before continuing.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-2">
                            Delete account
                        </h3>
                        <p className="text-gray-700 mb-2">
                            Deleting your account will:
                        </p>
                        <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-1">
                            <li>
                                Delete your profile, along with your
                                authentication associations. This does not
                                include applications permissions. You will have
                                to remove them yourself:
                            </li>
                            <ul className="pl-5 mb-2">
                                <li className="text-blue-600 hover:underline">
                                    <Link href="/">
                                        Google profile settings
                                    </Link>
                                </li>
                            </ul>
                            <li>
                                Delete any and all content you have, such as
                                articles, comments, or your reading list.
                            </li>
                            <li>
                                Allow your username to become available to
                                anyone.
                            </li>
                        </ul>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
