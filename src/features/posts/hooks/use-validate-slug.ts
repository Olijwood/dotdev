"use client";

import { useState, useEffect } from "react";
import { postBySlugExists } from "../server/db";

export const useValidateSlug = (slug: string, existingSlug = "") => {
    const [isValid, setIsValid] = useState(false);
    const [validSlugMsg, setValidSlugMsg] = useState("");

    useEffect(() => {
        const validateSlug = async () => {
            if (slug.length > 3 && slug.length < 100) {
                if (slug !== existingSlug) {
                    const exists = await postBySlugExists(slug);
                    setValidSlugMsg(
                        exists ? "This title is already in use!" : "",
                    );
                    setIsValid(!exists);
                } else {
                    setIsValid(true);
                    setValidSlugMsg("");
                }
            } else {
                setValidSlugMsg("");
                setIsValid(false);
            }
        };
        if (slug) validateSlug();
    }, [slug, existingSlug]);

    return { isValid, validSlugMsg };
};
