'use client';

import { useState } from 'react';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
}

interface TaskCardProps {
    task: Task;
    onUpdate: (id: string, status: Task['status'], title?: string, description?: string) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description);
    const statusColors = {
        pending: {
            border: 'border-red-700',
            text: 'text-red-700',
            bg: 'bg-red-700',
            shadow: '#b91c1c' // red-700 hex approx
        },
        'in-progress': {
            border: 'border-blue-700',
            text: 'text-blue-700',
            bg: 'bg-blue-700',
            shadow: '#1d4ed8' // blue-700 hex approx
        },
        completed: {
            border: 'border-green-700',
            text: 'text-green-700',
            bg: 'bg-green-700',
            shadow: '#15803d' // green-700 hex approx
        }
    };

    const colors = statusColors[task.status];

    const handleSave = () => {
        onUpdate(task._id, task.status, editTitle, editDesc);
        setIsEditing(false);
    };

    return (
        <div
            className={`group relative bg-[#FFFDF2] border-2 ${colors.border} p-6 transition-all hover:-translate-y-1`}
            style={{
                boxShadow: `8px 8px 0px 0px ${colors.shadow}`
            }}
        >

            {!isEditing && (
                <>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-black font-serif line-clamp-1 pr-4 uppercase tracking-wide">
                            {task.title}
                        </h3>
                        <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold border ${colors.border} ${colors.bg} text-white`}>
                            {task.status === 'in-progress' ? 'ACTIVE' : task.status}
                        </span>
                    </div>

                    <div className="mb-8 font-sans text-sm text-gray-600 min-h-[3rem]">
                        {task.description.split('\n').map((line, index) => {
                            if (!line.trim()) return <br key={index} />;

                            const isChecked = line.trim().toLowerCase().startsWith('[x]');
                            const text = line.replace(/^\[x\]/i, '').trim();

                            return (
                                <div
                                    key={index}
                                    className="flex items-start mb-2 group/item cursor-pointer"
                                    onClick={() => {
                                        const lines = task.description.split('\n');
                                        // Toggle [x]
                                        if (isChecked) {
                                            lines[index] = text; // Remove [x]
                                        } else {
                                            lines[index] = `[x] ${text}`; // Add [x]
                                        }

                                        const newDescription = lines.join('\n');

                                        // Auto-status logic
                                        const nonEmptyLines = lines.filter(l => l.trim().length > 0);
                                        const allChecked = nonEmptyLines.length > 0 && nonEmptyLines.every(l => l.trim().toLowerCase().startsWith('[x]'));

                                        let newStatus = task.status;
                                        if (allChecked && task.status !== 'completed') {
                                            newStatus = 'completed';
                                        } else if (!allChecked && task.status === 'completed') {
                                            newStatus = 'in-progress';
                                        }

                                        onUpdate(task._id, newStatus, task.title, newDescription);
                                    }}
                                >
                                    <span
                                        className={`leading-tight transition-all duration-500 select-none bg-gradient-to-r from-black to-black bg-no-repeat bg-[length:0%_2px] bg-[5%_55%] ${isChecked
                                            ? '!bg-[length:100%_2px] text-gray-400 opacity-60'
                                            : 'text-black font-medium hover:text-gray-600'
                                            }`}
                                    >
                                        {text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {isEditing && (
                <div className="mb-4 space-y-3">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full font-bold text-lg border-b border-black bg-transparent focus:outline-none uppercase tracking-wide"
                    />
                    <div className="relative">
                        <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full text-sm border border-black bg-transparent p-2 focus:outline-none font-sans min-h-[100px]"
                            placeholder="Type your items here... (Each line is a task)"
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsEditing(false)} className="text-xs font-bold uppercase hover:underline">Cancel</button>
                        <button onClick={handleSave} className="bg-black text-[#FFFDF2] px-3 py-1 text-xs font-bold uppercase">Save</button>
                    </div>
                </div>
            )}

            <div className={`flex items-center justify-between pt-4 border-t-2 ${colors.border}`}>
                <div className="relative flex items-center gap-4">
                    <select
                        value={task.status}
                        onChange={(e) => onUpdate(task._id, e.target.value as Task['status'], task.title, task.description)}
                        className={`appearance-none bg-transparent font-bold uppercase text-xs tracking-wider cursor-pointer pr-6 focus:outline-none ${colors.text}`}
                    >
                        <option value="pending" className="text-red-700 font-bold">Mark as Pending</option>
                        <option value="in-progress" className="text-blue-700 font-bold">Mark as Active</option>
                        <option value="completed" className="text-green-700 font-bold">Mark as Done</option>
                    </select>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-black uppercase text-xs font-bold tracking-widest hover:underline"
                        >
                            Edit
                        </button>
                    )}
                </div>

                <button
                    onClick={() => onDelete(task._id)}
                    className="text-black uppercase text-xs font-bold tracking-widest hover:bg-black hover:text-[#FFFDF2] px-2 py-1 transition-colors"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}
