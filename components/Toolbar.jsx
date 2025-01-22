import React, { useState, useEffect } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function Toolbar({ children }) {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth <= 900);
        };

        checkScreenSize(); // Initial check
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
    }, []);

    return (
        <TooltipProvider>
            <div
                className={
                    isSmallScreen ? "bbar-container" : "sidebar-container"
                }
            >
                {children(isSmallScreen)}
            </div>
        </TooltipProvider>
    );
}
