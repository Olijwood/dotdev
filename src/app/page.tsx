import { Loader } from "@/components/ui/loader";

export default function Home() {
    return (
        <section className="relative flex size-full flex-col items-center justify-center gap-5">
            <Loader size="xl" />
        </section>
    );
}
