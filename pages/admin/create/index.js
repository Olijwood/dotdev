import AuthCheck from "@/components/AuthCheck";
import CreatePost from "@/components/CreatePost";

export default function AdminCreatePage({}) {
    return (
        <main>
            <AuthCheck>
                <CreatePost />
            </AuthCheck>
        </main>
    );
}
