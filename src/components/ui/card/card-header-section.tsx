"use client";

type HeaderProps = {
    label?: string;
    title?: string;
};

const CardHeaderSection = ({ title, label }: HeaderProps) => {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-y-4 px-2 text-center">
            {title && <h1 className="text-[1.5rem] font-semibold">{title}</h1>}
            {label && <p className="text-sm text-muted-foreground">{label}</p>}
        </div>
    );
};

export default CardHeaderSection;
