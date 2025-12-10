import { useState } from 'react';

export const StartButton = ({ onStart, audioReady }) => {
    const [show, setShow] = useState(true); // Always show on page load

    const handleClick = () => {
        console.log("🎯 Start button clicked!");
        setShow(false);
        onStart?.();
    };

    // Don't show if already hidden or if audio not ready
    if (!show || !audioReady) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <button
                onClick={handleClick}
                className="px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-pink-500/50 animate-pulse"
            >
                🎤 Start Chat with Aima
            </button>
        </div>
    );
};
