"use client";
type StepIndicatorProps = {
    currentStep: number;
    totalSteps: number;
};

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full ${
                        index + 1 === currentStep
                            ? "bg-[#3b49df]"
                            : index + 1 < currentStep
                              ? "bg-[#8a8ddf]"
                              : "bg-gray-300"
                    }`}
                />
            ))}
        </div>
    );
}
