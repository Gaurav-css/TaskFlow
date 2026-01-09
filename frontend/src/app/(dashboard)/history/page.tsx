'use client';

import { useState, useEffect } from 'react';
import api from '../../../services/api'; // Adjust path if needed
import { useRouter } from 'next/navigation';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    deletedAt?: string;
}

export default function HistoryPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchTrash = async () => {
        try {
            const { data } = await api.get('/tasks/trash');
            setTasks(data);
        } catch (error) {
            console.error('Error fetching trash', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    const handleRestore = async (id: string) => {
        try {
            // Optimistic update
            setTasks(tasks.filter(t => t._id !== id));
            await api.put(`/tasks/${id}/restore`);
        } catch (error) {
            console.error('Error restoring task', error);
            fetchTrash(); // Revert on error
        }
    };

    const handlePermanentDelete = async (id: string) => {
        if (!window.confirm('Are you sure? This cannot be undone.')) return;
        try {
            // Optimistic update
            setTasks(tasks.filter(t => t._id !== id));
            await api.delete(`/tasks/${id}/permanent`);
        } catch (error) {
            console.error('Error deleting task permanently', error);
            fetchTrash(); // Revert on error
        }
    };

    if (loading) return <div className="p-8 text-center font-serif">Loading history...</div>;

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            <h1 className="text-4xl md:text-6xl font-black mb-8 text-black tracking-tighter uppercase relative inline-block">
                History
                <div className="absolute -bottom-2 left-0 w-1/2 h-4 bg-[#F2F0E4] -z-10 rotate-1"></div>
            </h1>

            <p className="mb-8 font-serif italic text-gray-500">
                Tasks deleted within the last 24 hours can be recovered here.
            </p>

            {tasks.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-400 uppercase tracking-widest font-bold">No deleted items found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="group relative bg-gray-100 border-2 border-gray-300 p-6 opacity-75 hover:opacity-100 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-700 font-serif line-clamp-1 pr-4 uppercase tracking-wide decoration-line-through">
                                    {task.title}
                                </h3>
                                <span className="px-2 py-1 text-[10px] uppercase tracking-widest font-bold bg-gray-200 text-gray-500">
                                    Deleted
                                </span>
                            </div>

                            <div className="mb-8 font-sans text-sm text-gray-500 min-h-[3rem] line-clamp-3">
                                {task.description}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                                <button
                                    onClick={() => handleRestore(task._id)}
                                    className="text-blue-600 uppercase text-xs font-bold tracking-widest hover:underline"
                                >
                                    Restore
                                </button>
                                <button
                                    onClick={() => handlePermanentDelete(task._id)}
                                    className="text-red-600 uppercase text-xs font-bold tracking-widest hover:underline"
                                >
                                    Delete Forever
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
