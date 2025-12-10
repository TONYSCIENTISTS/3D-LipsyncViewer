import { useState, useEffect } from 'react';

export const LoadingProgress = ({ progress, onReady }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    const isReady = progress >= 100;

    const handleClick = () => {
        if (isReady && onReady) {
            onReady();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={handleClick}
            style={{ cursor: isReady ? 'pointer' : 'default' }}
        >
            <div className="flex flex-col items-center gap-6">
                {/* Circular Progress */}
                <div className="relative w-40 h-40">
                    <svg className="w-40 h-40 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="8"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-300"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Percentage text or Start button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {isReady ? (
                            <button className="w-28 h-28 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-xl hover:scale-110 transition-all duration-300 animate-pulse flex items-center justify-center">
                                Start
                            </button>
                        ) : (
                            <span className="text-4xl font-bold text-white">
                                {Math.round(progress)}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Loading text */}
                <div className={`text-white text-xl font-semibold ${isReady ? 'animate-pulse' : ''}`}>
                    {isReady ? '🎤 Tap to Start' : 'Preparing Aima...'}
                </div>
            </div>
        </div>
    );
};
