"use client";

import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { admin } from "@/app/server/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FormSuccess } from "@/components/ui/form";
import { RoleGate } from "@/features/auth/components/role-gate";

const AdminPage = () => {
    const onServerActionClick = () => {
        admin().then((response) => {
            if (response.success) {
                toast.success(response.success);
            }
            if (response.error) {
                toast.error(response.error);
            }
        });
    };
    const onApiRouteClick = () => {
        fetch("/api/admin").then((response) => {
            if (response.ok) {
                toast.success("Allowed API route");
            } else {
                toast.error("Forbidden API route");
            }
        });
    };

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-center text-2xl font-semibold">Admin</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="You are allowed to see this content!" />
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">Admin-only API route</p>
                    <Button onClick={onApiRouteClick}>Click to test</Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-only Server Action
                    </p>
                    <Button onClick={onServerActionClick}>Click to test</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminPage;
