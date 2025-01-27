import { auth } from "@/lib/auth";

async function DashboardPage() {
    const session = await auth();
    console.log(session);

    return <div> DashboardPage</div>;
}

export default DashboardPage;
