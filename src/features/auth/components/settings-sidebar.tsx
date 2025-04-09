"use client";

import { Smile, UserIcon } from "lucide-react";

type SettingsSidebarProps = {
    activeSection: string;
    setActiveSection: (section: string) => void;
};

export function SettingsSidebar({
    activeSection,
    setActiveSection,
}: SettingsSidebarProps) {
    const menuItems = [
        {
            id: "profile",
            label: "Profile",
            icon: <Smile className="w-5 h-5" />,
        },
        {
            id: "account",
            label: "Account",
            icon: <UserIcon className="w-5 h-5" />,
        },
    ];

    return (
        <div className="p-4">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    className={`flex items-center gap-3 w-full p-3 text-left rounded-md mb-2 ${
                        activeSection === item.id
                            ? "bg-white font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveSection(item.id)}
                >
                    {item.icon}
                    {item.label}
                </button>
            ))}
        </div>
    );
}
