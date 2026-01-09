'use client';

import { useState } from 'react';
import api from '../../../services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('/auth/forgotpassword', { email });
            setMessage('Password reset link sent to your email');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send email');
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
                    Forgot Password
                </h2>
                <p className="text-center text-sm mb-6 mt-4 font-sans tracking-widest text-gray-600 uppercase">
                    Enter your email to reset
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

                <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="w-full bg-[#FFFDF2] border border-black px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-black text-[#FFFDF2] font-bold py-4 hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm border-2 border-transparent disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-8 border-t-2 border-black pt-6 text-center">
                    <Link href="/login" className="text-sm font-bold border-b border-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
