'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            login(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF2] flex flex-col items-center justify-center p-4 font-serif text-black">
            <div className="w-full max-w-md bg-[#FFFDF2] border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl font-bold text-black mb-2 text-center tracking-wide uppercase border-b-2 border-black pb-4">
                    Register
                </h2>
                <p className="text-center text-sm mb-8 mt-4 font-sans tracking-widest text-gray-600 uppercase">
                    Join Our Community
                </p>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 text-sm text-center font-sans">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                    <div>
                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            className="w-full bg-[#FFFDF2] border border-black px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="username"
                            className="w-full bg-[#FFFDF2] border border-black px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider mb-2">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            className="w-full bg-[#FFFDF2] border border-black px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-black text-[#FFFDF2] font-bold py-4 hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm border-2 border-transparent disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 border-t-2 border-black pt-6 text-center">
                    <p className="text-sm font-sans">
                        Already Member?{' '}
                        <Link href="/login" className="font-bold border-b border-black hover:text-gray-600 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
