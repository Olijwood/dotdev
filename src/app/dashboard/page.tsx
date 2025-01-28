import { auth } from "@/lib/auth";

async function DashboardPage() {
    const session = await auth();
    if (session) {
    }
    return <div> DashboardPage</div>;
}

export default DashboardPage;
