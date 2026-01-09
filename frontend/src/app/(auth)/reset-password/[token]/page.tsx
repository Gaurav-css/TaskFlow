'use client';

import { useState } from 'react';
import api from '../../../../services/api'; // src/app/(auth)/reset-password/[token] -> ../../../../services/api
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation'; // Correct hook for App Router params? Actually useParams
import { motion } from 'framer-motion';
import { useAuth } from '../../../../context/AuthContext';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const params = useParams();
    const token = params.token as string;
    const { login } = useAuth(); // Optional: auto-login after reset

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await api.put(`/auth/resetpassword/${token}`, { password });
            setMessage('Password reset successful! Redirecting...');

            // Auto login logic if token returned, or just redirect
            if (data.token) {
                // We need to update context manually if we want auto-login, 
                // but easier to just redirect to login for security flow usually.
                // However, user passed matchPassword logic.
                // Let's redirect to login for simplicity and safety.
                setTimeout(() => router.push('/login'), 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF2] flex flex-col items-center justify-center p-4 font-serif text-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#FFFDF2] border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
                <h2 className="text-2xl font-bold text-black mb-2 text-center tracking-wide uppercase border-b-2 border-black pb-4">
                    Reset Password
                </h2>
                <p className="text-center text-sm mb-6 mt-4 font-sans tracking-widest text-gray-600 uppercase">
                    Enter your new password
                </p>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 text-sm text-center font-sans">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-3 bg-green-50 text-green-600 border border-green-200 text-sm text-center font-sans">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                    <div>
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider mb-2">New Password</label>
                        <input
                            id="password"
                            type="password"
                            className="w-full bg-[#FFFDF2] border border-black px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider mb-2">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="w-full bg-[#FFFDF2] border border-black px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-black text-[#FFFDF2] font-bold py-4 hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm border-2 border-transparent disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Set New Password'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
