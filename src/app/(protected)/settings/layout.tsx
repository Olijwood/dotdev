"use client";

import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SettingsSidebar } from "@/features/auth/components/settings-sidebar";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeSection, setActiveSection] = useState("profile");

    return (
        <main className="scrollbar-y scrollbar-thin flex h-[var(--main-height)] flex-col sm:flex-row  max-w-[1280px] mx-auto bg-neutral-200">
            {/* Sidebar - only visible on desktop */}
            <div className="hidden sm:block w-[240px]">
                <SettingsSidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />
            </div>

            {/* Main content area */}
            <div className="flex-1 sm:pt-4">
                {/* Mobile dropdown - only visible on mobile */}
                <div className="sm:hidden p-4">
                    <select
                        className="w-full p-3 border rounded-md bg-white"
                        value={activeSection}
                        onChange={(e) => setActiveSection(e.target.value)}
                    >
                        <option value="profile">Profile</option>
                        <option value="account">Account</option>
                    </select>
                </div>

                {/* Content for the active section */}
                <div className="px-0 sm:px-4 pt-0">{children}</div>
            </div>
            <Toaster position={"top-center"} className="bg-gray-100" />
        </main>
    );
}
