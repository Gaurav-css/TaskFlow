'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt?: string;
    isStarred?: boolean;
}

interface TaskCardProps {
    task: Task;
    onUpdate: (id: string, status: Task['status'], title?: string, description?: string, isStarred?: boolean) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description);

    // Confetti trigger helper
    const triggerConfetti = () => {
        const end = Date.now() + 1000;
        const colors = ['#bb0000', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

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

    const colors = task.isStarred ? {
        border: 'border-red-600',
        text: 'text-red-600',
        bg: 'bg-red-600',
        shadow: '#dc2626'
    } : statusColors[task.status];

    const handleSave = () => {
        onUpdate(task._id, task.status, editTitle, editDesc);
        setIsEditing(false);
    };

    const handleStarClick = () => {
        const newStarredState = !task.isStarred;

        if (newStarredState) {
            // Heart animation
            confetti({
                particleCount: 30,
                spread: 60,
                origin: { x: 0.5, y: 0.5 },
                colors: ['#ef4444', '#dc2626'],
                shapes: ['circle'], // 'heart' shape requires shape: 'heart' which isn't standard in basic package without config object, but circle red works well or we try shape: 'star'
                scalar: 1.2
            });
        }

        onUpdate(task._id, task.status, task.title, task.description, newStarredState);
    };

    return (
        <div
            className={`group relative bg-[#FFFDF2] border-2 ${colors.border} p-6 transition-all md:hover:-translate-y-1 hover:z-10 z-0 duration-300`}
            style={{
                boxShadow: `8px 8px 0px 0px ${colors.shadow}`
            }}
        >
            <button
                onClick={handleStarClick}
                className={`absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full border-2 border-black bg-[#FFFDF2] transition-transform hover:scale-110 z-20 ${task.isStarred ? 'scale-110' : 'opacity-0 group-hover:opacity-100'}`}
                title={task.isStarred ? "Unmark Important" : "Mark as Important"}
            >
                <span className={`text-xl leading-none ${task.isStarred ? 'text-red-600' : 'text-gray-300 hover:text-red-400'}`}>
                    ★
                </span>
            </button>

            {!isEditing && (
                <>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                            {task.createdAt && (
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                    {new Date(task.createdAt).toLocaleString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}
                                </p>
                            )}
                            <h3 className="text-lg font-bold text-black font-serif line-clamp-1 uppercase tracking-wide">
                                {task.title}
                            </h3>
                        </div>
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
                                            triggerConfetti();
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const textarea = e.currentTarget;
                                    const value = textarea.value;
                                    const selectionStart = textarea.selectionStart;

                                    const currentLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
                                    const currentLineEnd = value.indexOf('\n', selectionStart);
                                    const currentLine = value.substring(currentLineStart, currentLineEnd === -1 ? value.length : currentLineEnd);

                                    // Match "1." or "1)" at start of line
                                    const match = currentLine.match(/^(\d+)([\.\)])\s/);
                                    if (match) {
                                        // If line is empty (just number), remove it
                                        if (currentLine.trim() === match[0].trim()) {
                                            e.preventDefault();
                                            const newValue = value.substring(0, currentLineStart) + value.substring(selectionStart);
                                            setEditDesc(newValue);
                                            return;
                                        }

                                        e.preventDefault();
                                        const currentNumber = parseInt(match[1], 10);
                                        const separator = match[2]; // . or )
                                        const nextNumber = currentNumber + 1;
                                        const nextLine = `\n${nextNumber}${separator} `;

                                        const newValue = value.substring(0, selectionStart) + nextLine + value.substring(textarea.selectionEnd);
                                        setEditDesc(newValue);

                                        requestAnimationFrame(() => {
                                            textarea.selectionStart = textarea.selectionEnd = selectionStart + nextLine.length;
                                        });
                                    }
                                }
                            }}
                            className="w-full text-sm border border-black bg-transparent p-2 focus:outline-none font-sans min-h-[100px]"
                            placeholder="Type your items here... (Each line is a task). Start with '1. ' for auto-numbering."
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
                        onChange={(e) => {
                            const newStatus = e.target.value as Task['status'];
                            if (newStatus === 'completed' && task.status !== 'completed') {
                                triggerConfetti();
                            }
                            onUpdate(task._id, newStatus, task.title, task.description);
                        }}
                        className={`appearance-none bg-transparent font-bold uppercase text-xs tracking-wider cursor-pointer pr-6 py-2 focus:outline-none ${colors.text}`}
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

            {/* Completed Stamp Effect */}
            {task.status === 'completed' && (
                <>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-green-700 text-green-700 px-4 py-2 font-black text-2xl uppercase tracking-widest opacity-20 pointer-events-none select-none z-10 whitespace-nowrap">
                        Completed
                    </div>
                    <div className="absolute bottom-2 right-16 text-[10px] font-bold text-green-700 uppercase tracking-widest animate-pulse">
                        Great Job!
                    </div>
                </>
            )}
        </div>
    );
}
