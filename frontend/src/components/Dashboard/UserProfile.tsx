'use client';

import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
    const { user } = useAuth();

    if (!user) return null;

    const initials = user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <div className="bg-[#FFFDF2] border-2 border-black p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-black flex items-center justify-center mb-4 rounded-full border-2 border-black ring-4 ring-[#FFFDF2] ring-offset-2 ring-offset-black">
                <span className="text-xl font-bold text-[#FFFDF2] font-serif">
                    {initials}
                </span>
            </div>

            <h2 className="text-lg font-bold text-black uppercase tracking-wider mb-1">{user.name}</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-6 font-sans">{user.email}</p>

            <div className="w-full h-px bg-black mb-6"></div>

            <div className="flex justify-center gap-3">
                <span className="inline-block px-3 py-1 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-[#FFFDF2] transition-colors cursor-default">
                    Member
                </span>
            </div>
        </div>
    );
}
