'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import TaskCard from '../../../components/TaskCard';
import TaskFilters from '../../../components/Dashboard/TaskFilters';
import UserProfile from '../../../components/Dashboard/UserProfile';

import Tour from '../../../components/Tour';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    isStarred?: boolean;
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filters, setFilters] = useState({ search: '', status: 'all' });
    const [isAdding, setIsAdding] = useState(false);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTasks = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.status !== 'all') params.append('status', filters.status);

            const { data } = await api.get(`/tasks?${params.toString()}`);

            // Sort: Pending/Active first, Completed last
            const sortedData = data.sort((a: Task, b: Task) => {
                if (a.status === 'completed' && b.status !== 'completed') return 1;
                if (a.status !== 'completed' && b.status === 'completed') return -1;
                return 0; // Keep original order otherwise
            });

            setTasks(sortedData);
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    }, [filters]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/tasks', { title, description });
            setTitle('');
            setDescription('');
            setIsAdding(false);
            fetchTasks();
        } catch (error) {
            console.error('Error adding task', error);
            alert("Failed to add task. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTask = async (id: string, status: Task['status'], title?: string, description?: string, isStarred?: boolean) => {
        // Optimistic Update
        const originalTasks = [...tasks];

        setTasks(prev => {
            const updatedTasks = prev.map(task =>
                task._id === id ? { ...task, status, title: title || task.title, description: description || task.description, isStarred: isStarred !== undefined ? isStarred : task.isStarred } : task
            );

            // Re-apply sort: Starred first, then completed last
            return updatedTasks.sort((a, b) => {
                if (a.isStarred && !b.isStarred) return -1;
                if (!a.isStarred && b.isStarred) return 1;
                if (a.status === 'completed' && b.status !== 'completed') return 1;
                if (a.status !== 'completed' && b.status === 'completed') return -1;
                return 0;
            });
        });

        try {
            await api.put(`/tasks/${id}`, { status, title, description, isStarred });
            // Background revalidation (optional, but good for consistency)
            // We skip fetchTasks() to avoid UI flicker, trusting our optimistic update.
        } catch (error) {
            console.error('Error updating task', error);
            setTasks(originalTasks); // Rollback
            alert("Failed to update task. Please check your connection.");
        }
    };

    const handleDeleteTask = async (id: string) => {
        // Optimistic Update
        const originalTasks = [...tasks];
        setTasks(prev => prev.filter(t => t._id !== id));

        try {
            await api.delete(`/tasks/${id}`);
        } catch (error) {
            console.error('Error deleting task', error);
            setTasks(originalTasks); // Rollback
            alert("Failed to delete task.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF2] text-black pb-20 font-serif">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div id="tour-profile">
                            <UserProfile />
                        </div>
                        <div id="tour-stats" className="block p-6 bg-[#FFFDF2] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4 border-b border-black pb-2">Overview</h3>
                            <div className="font-sans grid grid-cols-3 gap-2 lg:block lg:space-y-4 text-center lg:text-left">
                                <div className="flex flex-col lg:flex-row justify-between items-center">
                                    <span className="text-gray-600 text-[10px] lg:text-sm uppercase">Total</span>
                                    <span className="font-bold text-lg lg:text-xl">{tasks.length}</span>
                                </div>
                                <div className="flex flex-col lg:flex-row justify-between items-center">
                                    <span className="text-gray-600 text-[10px] lg:text-sm uppercase">Pending</span>
                                    <span className="font-bold text-lg lg:text-xl">{tasks.filter(t => t.status === 'pending').length}</span>
                                </div>
                                <div className="flex flex-col lg:flex-row justify-between items-center">
                                    <span className="text-gray-600 text-[10px] lg:text-sm uppercase">Done</span>
                                    <span className="font-bold text-lg lg:text-xl">{tasks.filter(t => t.status === 'completed').length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b-2 border-black pb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-black uppercase tracking-tight">
                                    Dashboard
                                </h1>
                                <p className="text-gray-600 mt-2 font-sans text-sm tracking-wide">MANAGE YOUR TASKS</p>
                            </div>

                            <button
                                id="tour-new-entry"
                                onClick={() => setIsAdding(!isAdding)}
                                className="bg-black text-[#FFFDF2] px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-all border-2 border-transparent shadow-[4px_4px_0px_0px_#999]"
                            >
                                {isAdding ? 'Close Panel' : 'New Entry'}
                            </button>
                        </div>

                        {isAdding && (
                            <div className="mb-10 p-8 bg-[#FFFDF2] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="text-xl font-bold mb-6 text-black uppercase tracking-wide border-b border-black pb-2">New Entry Details</h3>
                                <form onSubmit={handleAddTask} className="space-y-6 font-sans">
                                    <input
                                        type="text"
                                        placeholder="TITLE"
                                        className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black px-2 py-3 text-lg focus:outline-none transition-all placeholder:text-gray-300"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        placeholder="DETAILS (OPTIONAL) - Start with '1. ' to create a numbered list"
                                        className="w-full bg-transparent border-2 border-gray-200 focus:border-black p-4 text-sm focus:outline-none transition-all placeholder:text-gray-300 resize-none h-32 font-sans"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const textarea = e.currentTarget;
                                                const value = textarea.value;
                                                const selectionStart = textarea.selectionStart;

                                                const currentLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
                                                const currentLineEnd = value.indexOf('\n', selectionStart);
                                                const currentLine = value.substring(currentLineStart, currentLineEnd === -1 ? value.length : currentLineEnd);

                                                // Match "1." or "1)" or "1 " at start of line
                                                const match = currentLine.match(/^(\d+)([\.\)])\s/);
                                                if (match) {
                                                    // If line is empty (just number), remove it
                                                    if (currentLine.trim() === match[0].trim()) {
                                                        e.preventDefault();
                                                        const newValue = value.substring(0, currentLineStart) + value.substring(selectionStart);
                                                        setDescription(newValue);
                                                        return;
                                                    }

                                                    e.preventDefault();
                                                    const currentNumber = parseInt(match[1], 10);
                                                    const separator = match[2]; // . or )
                                                    const nextNumber = currentNumber + 1;
                                                    const nextLine = `\n${nextNumber}${separator} `;

                                                    const newValue = value.substring(0, selectionStart) + nextLine + value.substring(textarea.selectionEnd);
                                                    setDescription(newValue);

                                                    requestAnimationFrame(() => {
                                                        textarea.selectionStart = textarea.selectionEnd = selectionStart + nextLine.length;
                                                    });
                                                }
                                            }
                                        }}
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-black text-[#FFFDF2] px-8 py-3 font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save Entry'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div id="tour-filters">
                                <TaskFilters onFilterChange={setFilters} />
                            </div>

                            <div id="tour-tasks" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                {tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            onUpdate={handleUpdateTask}
                                            onDelete={handleDeleteTask}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-300">
                                        <h3 className="text-xl font-bold text-black uppercase tracking-widest">No Entries Found</h3>
                                        <p className="text-gray-500 mt-2 font-sans text-sm">
                                            Your task list is currently empty
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Tour
                isOpen={isTourOpen}
                onClose={() => setIsTourOpen(false)}
                steps={TOUR_STEPS}
            />

            {/* Quick Tour Start Button - Floating bottom right ?? Or in header? Let's put it in the header next to new entry maybe? or fixed bottom right */}
            <button
                onClick={() => setIsTourOpen(true)}
                className="fixed bottom-8 right-8 bg-black text-[#FFFDF2] w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#FFFDF2] shadow-lg font-serif text-xl z-40 hover:scale-110 transition-transform"
                title="Start Tour"
            >
                ?
            </button>
        </div>
    );
}

const TOUR_STEPS = [
    {
        targetId: 'tour-profile',
        title: 'Identity',
        content: 'This is your member card. It shows your current status and credentials.',
        position: 'right' as const
    },
    {
        targetId: 'tour-stats',
        title: 'Overview',
        content: 'Track your task statistics here. Real-time updates of your pending and completed entries.',
        position: 'right' as const
    },
    {
        targetId: 'tour-new-entry',
        title: 'New Entry',
        content: 'Click here to open the log book and draft a new task.',
        position: 'bottom' as const
    },
    {
        targetId: 'tour-filters',
        title: 'Filters',
        content: 'Use these tools to search through your tasks or filter by status.',
        position: 'bottom' as const
    },
    {
        targetId: 'tour-tasks',
        title: 'Interaction',
        content: 'The specific feature: Click directly on any text in a card to strike it through instantly. No checkboxes required.',
        position: 'top' as const
    }
];
