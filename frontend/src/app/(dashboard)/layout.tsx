'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
            <Navbar />
            <main className="flex-grow pt-16">{children}</main>
        </div>
    );
}
