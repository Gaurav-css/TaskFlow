'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#FFFDF2] border-b-2 border-black h-16 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-center">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-black flex items-center justify-center">
                            <span className="text-[#FFFDF2] font-serif font-bold text-xl">T</span>
                        </div>
                        <span className="text-xl font-bold text-black uppercase tracking-widest font-serif">
                            MiniTask
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">

                        {user ? (
                            <div className="flex items-center space-x-6">
                                <Link href="/history" className="text-black uppercase text-xs font-bold tracking-widest hover:underline">
                                    History
                                </Link>
                                <span className="hidden md:block text-black text-xs font-bold uppercase tracking-wider">
                                    {user.email}
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-transparent text-black border-2 border-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-[#FFFDF2] transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-black uppercase text-xs font-bold tracking-wider hover:underline">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-black text-[#FFFDF2] border-2 border-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#FFFDF2] hover:text-black transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
