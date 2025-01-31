"use client";

import { logout } from "../server/actions/logout";

type LogoutButtonProps = {
    children?: React.ReactNode;
};

export const LogoutButton = ({ children }: LogoutButtonProps) => {
    const onClick = () => {
        logout();
    };

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};
