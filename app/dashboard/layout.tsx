'use client';

import DashboardShell from '@/components/DashboardShell';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Authentication check is handled within DashboardShell
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}
