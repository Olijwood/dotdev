"use client";

import { useState } from "react";

export function useMultiStepForm(totalSteps: number) {
    const [step, setStep] = useState(1);

    const isFirst = step === 1;
    const isLast = step === totalSteps;

    const handleNext = () => step < totalSteps && setStep((s) => s + 1);
    const handleBack = () => step > 1 && setStep((s) => s - 1);

    return {
        step,
        setStep,
        isFirst,
        isLast,
        handleNext,
        handleBack,
    };
}
