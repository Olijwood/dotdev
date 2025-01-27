import { auth } from "@/lib/auth";

const settingsPage = async () => {
    const session = await auth();
    const text = JSON.stringify(session, null, 2);
    return <div>{text}</div>;
};

export default settingsPage;
