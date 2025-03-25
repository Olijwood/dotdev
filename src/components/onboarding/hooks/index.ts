"use client";

import { useState, useEffect } from "react";
import { userByUsernameExists } from "../../../server/db/user";

export function useValidateUsername(username: string, existingUsername = "") {
    const [isValid, setIsValid] = useState(false);
    const [validUsernameMsg, setValidUsernameMsg] = useState("");

    useEffect(() => {
        const validateUsername = async () => {
            if (username.length > 3 && username.length < 100) {
                if (username !== existingUsername) {
                    const exists = await userByUsernameExists(username);
                    setValidUsernameMsg(
                        exists ? "This username is already in use!" : "",
                    );
                    setIsValid(!exists);
                } else {
                    setIsValid(true);
                    setValidUsernameMsg("");
                }
            } else {
                setValidUsernameMsg("");
                setIsValid(false);
            }
        };
        if (username) validateUsername();
    }, [username, existingUsername]);

    return { isValid, validUsernameMsg };
}
