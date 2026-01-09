'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import InteractiveBackground from '../components/Landing/InteractiveBackground';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="animate-pulse">Loading Experience...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-serif selection:bg-white selection:text-black">
      {/* Animated Canvas Background */}
      <InteractiveBackground />

      {/* Content Overlay */}
      <main className="relative z-10 flex flex-col justify-center items-center px-4 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.p
            className="text-sm md:text-base text-blue-400 font-bold uppercase tracking-[0.2em] mb-4"
            initial={{ opacity: 0, letterSpacing: "0em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            Welcome to TaskFlow
          </motion.p>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
              Daily Grind.
            </span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-white mx-auto mb-8"
          />

          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-12 font-sans tracking-wide max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            The Premium Task Management Web App.
            <br />Focus on what matters, let the chaos fall away.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/register" className="group">
              <div className="bg-white text-black px-10 py-4 text-lg font-bold uppercase tracking-widest border-2 border-white hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Start Journey
              </div>
            </Link>

            <Link href="/login" className="group">
              <div className="bg-transparent text-white px-10 py-4 text-lg font-bold uppercase tracking-widest border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300">
                Sign In
              </div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.footer
          className="absolute bottom-6 text-gray-600 text-xs uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          © {new Date().getFullYear()} TaskFlow / Premium Experience
        </motion.footer>
      </main>
    </div>
  );
}
