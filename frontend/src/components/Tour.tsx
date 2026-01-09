'use client';

import { useState, useEffect } from 'react';

interface TourStep {
    targetId: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourProps {
    steps: TourStep[];
    isOpen: boolean;
    onClose: () => void;
}

export default function Tour({ steps, isOpen, onClose }: TourProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [lineCoords, setLineCoords] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);

    // Reset when opening
    useEffect(() => {
        if (isOpen) setCurrentStepIndex(0);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const step = steps[currentStepIndex];
            const element = document.getElementById(step.targetId);

            if (element) {
                const rect = element.getBoundingClientRect();
                const scrollTop = window.scrollY;
                const isMobile = window.innerWidth < 1024; // Check if mobile/tablet

                // Basic positioning logic
                let top = 0;
                let left = 0;
                const buffer = 40; // Increased buffer for thread space
                const boxWidth = Math.min(window.innerWidth * 0.9, 320); // Responsive width calculation
                const boxHeight = 200; // Approx

                let startX = 0; // Box connection point
                let startY = 0;
                let endX = rect.left + (rect.width / 2); // Target center
                let endY = rect.top + scrollTop + (rect.height / 2);

                // Force center on mobile for better UX, or use simpler logic
                const activePosition = isMobile ? 'center' : step.position;

                switch (activePosition) {
                    case 'bottom':
                        top = rect.bottom + scrollTop + buffer;
                        left = rect.left + (rect.width / 2) - (boxWidth / 2);
                        startX = left + (boxWidth / 2);
                        startY = top;
                        endY = rect.bottom + scrollTop;
                        break;
                    case 'top':
                        top = rect.top + scrollTop - buffer - boxHeight;
                        left = rect.left + (rect.width / 2) - (boxWidth / 2);
                        startX = left + (boxWidth / 2);
                        startY = top + boxHeight;
                        endY = rect.top + scrollTop;
                        break;
                    case 'left':
                        top = rect.top + scrollTop;
                        left = rect.left - boxWidth - buffer;
                        startX = left + boxWidth;
                        startY = top + 50; // Somewhat middle of box
                        endX = rect.left;
                        break;
                    case 'right':
                        top = rect.top + scrollTop;
                        left = rect.right + buffer;
                        startX = left;
                        startY = top + 50;
                        endX = rect.right;
                        break;
                    case 'center':
                        // Handled in setStyle
                        break;
                }

                // Scroll to element
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setStyle({
                    top: activePosition === 'center' ? '50%' : `${top}px`,
                    left: activePosition === 'center' ? '50%' : `${left}px`,
                    transform: activePosition === 'center' ? 'translate(-50%, -50%)' : 'none',
                    position: activePosition === 'center' ? 'fixed' : 'absolute', // Fixed for center to avoid scroll issues
                    zIndex: 100
                });

                if (activePosition !== 'center') {
                    setLineCoords({ x1: startX, y1: startY, x2: endX, y2: endY });
                } else {
                    setLineCoords(null);
                }
            }
        };

        // Small delay to allow layout to settle
        const timer = setTimeout(updatePosition, 100);
        window.addEventListener('resize', updatePosition);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePosition);
        }
    }, [currentStepIndex, isOpen, steps]);

    if (!isOpen) return null;

    const step = steps[currentStepIndex];
    const isLast = currentStepIndex === steps.length - 1;

    const handleNext = () => {
        if (isLast) {
            onClose();
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    return (
        <div className="absolute inset-0 z-50 pointer-events-none h-full w-full">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/20 pointer-events-auto" onClick={onClose} />

            {/* Thread Line */}
            {lineCoords && (
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" style={{ height: '200vh' }}>
                    {/* The Thread */}
                    <path
                        d={`M${lineCoords.x1} ${lineCoords.y1} Q ${(lineCoords.x1 + lineCoords.x2) / 2} ${(lineCoords.y1 + lineCoords.y2) / 2 + 20} ${lineCoords.x2} ${lineCoords.y2}`}
                        stroke="black"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4 2"
                    />
                    {/* Target Dot */}
                    <circle cx={lineCoords.x2} cy={lineCoords.y2} r="4" fill="black" />
                    {/* Box Dot */}
                    <circle cx={lineCoords.x1} cy={lineCoords.y1} r="3" fill="black" />
                </svg>
            )}

            <div
                className="pointer-events-auto absolute w-[90vw] sm:w-80 bg-[#FFFDF2] border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                style={style}
            >
                <div className="flex justify-between items-start mb-4 border-b border-black pb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Tip {currentStepIndex + 1} / {steps.length}
                    </span>
                    <button onClick={onClose} className="text-black hover:bg-black hover:text-[#FFFDF2] px-1">✕</button>
                </div>

                <h3 className="text-lg font-bold text-black uppercase mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 font-sans mb-6 leading-relaxed">
                    {step.content}
                </p>

                <div className="flex justify-between mt-auto">
                    <button
                        onClick={handleBack}
                        disabled={currentStepIndex === 0}
                        className={`text-xs font-bold uppercase px-4 py-2 border border-black transition-colors ${currentStepIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black hover:text-[#FFFDF2]'}`}
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="text-xs font-bold uppercase px-4 py-2 bg-black text-[#FFFDF2] border border-black hover:opacity-80 transition-opacity shadow-[2px_2px_0px_0px_#999]"
                    >
                        {isLast ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}
