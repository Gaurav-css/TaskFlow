'use client';

import { useState, useEffect } from 'react';

interface TaskFiltersProps {
    onFilterChange: (filters: { search: string; status: string }) => void;
}

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onFilterChange({ search, status });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, status, onFilterChange]);

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
                <input
                    type="text"
                    placeholder="SEARCH TASKS..."
                    className="w-full bg-[#FFFDF2] border-b-2 border-gray-300 focus:border-black px-4 py-3 text-sm font-sans tracking-wide text-black focus:outline-none transition-all placeholder:text-gray-400 placeholder:uppercase placeholder:text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div>
                <select
                    className="w-full md:w-48 bg-[#FFFDF2] border-b-2 border-gray-300 focus:border-black px-4 py-3 text-sm font-bold uppercase tracking-widest text-black focus:outline-none transition-all cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="all">View All</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">Active</option>
                    <option value="completed">Done</option>
                </select>
            </div>
        </div>
    );
}
