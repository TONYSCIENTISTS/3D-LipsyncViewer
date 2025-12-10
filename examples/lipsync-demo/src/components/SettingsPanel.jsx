import { useState, useEffect } from "react";

export const SettingsPanel = ({
    quality,
    onQualityChange,
    backgroundColor,
    onBackgroundColorChange,
    lightIntensity,
    onLightIntensityChange,
    smoothMovements,
    onSmoothMovementsChange,
    selectedCharacter,
    onCharacterChange,
    onSave
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialCharacter, setInitialCharacter] = useState(selectedCharacter);
    const [characterChanged, setCharacterChanged] = useState(false);

    // Track when settings panel opens to store initial character
    useEffect(() => {
        if (isOpen) {
            setInitialCharacter(selectedCharacter);
            setCharacterChanged(false);
        }
    }, [isOpen]);

    // Track when character changes
    useEffect(() => {
        if (isOpen) {
            setCharacterChanged(selectedCharacter !== initialCharacter);
        }
    }, [selectedCharacter, initialCharacter, isOpen]);

    const handleCharacterChange = (character) => {
        onCharacterChange(character);
    };

    const handleClose = () => {
        if (!characterChanged) {
            setIsOpen(false);
        }
    };

    const handleSave = () => {
        onSave();
        setCharacterChanged(false);
        setIsOpen(false);
    };

    return (
        <>
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-[50px] right-5 bg-black/50 backdrop-blur p-3 rounded-lg hover:bg-black/70 transition-colors z-[100]"
                title="Settings"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </button>

            {/* Settings Panel - Full Page */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white z-[1000] overflow-y-auto"
                    style={{ touchAction: 'pan-y' }}
                    onTouchMove={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                >
                    <div className="max-w-2xl mx-auto p-8">
                        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">⚙️ Settings</h2>

                        {/* Character Selection */}
                        <div className="mb-8 bg-white/5 p-6 rounded-xl backdrop-blur">
                            <label className="block text-lg font-semibold mb-4">Choose Character</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleCharacterChange("aima")}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedCharacter === "aima" ? "border-blue-500 ring-2 ring-blue-500/50" : "border-gray-600 hover:border-gray-400"
                                        }`}
                                >
                                    <img
                                        src="/images/aima_pfp.png"
                                        alt="Aima Character"
                                        className="w-full h-full object-cover"
                                    />
                                    {selectedCharacter === "aima" && (
                                        <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                                            <svg className="w-3 h-3" fill="white" viewBox="0 0 20 20">
                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs py-1 text-center">
                                        Aima
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleCharacterChange("sara")}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedCharacter === "sara" ? "border-blue-500 ring-2 ring-blue-500/50" : "border-gray-600 hover:border-gray-400"
                                        }`}
                                >
                                    <img
                                        src="/images/sara_pfp.png"
                                        alt="Sara Character"
                                        className="w-full h-full object-cover"
                                    />
                                    {selectedCharacter === "sara" && (
                                        <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                                            <svg className="w-3 h-3" fill="white" viewBox="0 0 20 20">
                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs py-1 text-center">
                                        Sara
                                    </div>
                                </button>

                            </div>
                        </div>

                        {/* Quality Settings */}
                        <div className="mb-8 bg-white/5 p-6 rounded-xl backdrop-blur">
                            <label className="block text-lg font-semibold mb-3">Quality</label>
                            <select
                                value={quality}
                                onChange={(e) => onQualityChange(e.target.value)}
                                className="w-full bg-gray-800 text-white px-3 py-2 rounded cursor-pointer"
                            >
                                <option value="Low">Low (Best Performance)</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Ultra">Ultra (Maximum Quality)</option>
                            </select>
                        </div>

                        {/* Background Color */}
                        <div className="mb-8 bg-white/5 p-6 rounded-xl backdrop-blur">
                            <label className="block text-lg font-semibold mb-3">Background</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-400">Top Color</label>
                                    <input
                                        type="color"
                                        value={backgroundColor.top}
                                        onChange={(e) => onBackgroundColorChange(Object.assign({}, backgroundColor, { top: e.target.value }))}
                                        className="w-full h-10 rounded cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Bottom Color</label>
                                    <input
                                        type="color"
                                        value={backgroundColor.bottom}
                                        onChange={(e) => onBackgroundColorChange(Object.assign({}, backgroundColor, { bottom: e.target.value }))}
                                        className="w-full h-10 rounded cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Light Intensity */}
                        <div className="mb-8 bg-white/5 p-6 rounded-xl backdrop-blur">
                            <label className="block text-lg font-semibold mb-3">
                                Light Intensity: {lightIntensity.toFixed(1)}x
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="3"
                                step="0.1"
                                value={lightIntensity}
                                onChange={(e) => onLightIntensityChange(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Smooth Movements Toggle */}
                        <div className="mb-8 bg-white/5 p-6 rounded-xl backdrop-blur">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={smoothMovements}
                                    onChange={(e) => onSmoothMovementsChange(e.target.checked)}
                                    className="w-5 h-5 rounded cursor-pointer"
                                />
                                <span className="ml-3 text-lg font-semibold">Smooth Movements</span>
                            </label>
                            <p className="text-sm text-gray-400 mt-2 ml-8">Enable smooth lip-sync transitions</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 gap-4 mt-8">
                            {characterChanged && (
                                <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 mb-4">
                                    <p className="text-yellow-300 text-sm font-semibold">⚠️ Character changed! You must save to apply changes.</p>
                                </div>
                            )}
                            <button
                                onClick={handleClose}
                                disabled={characterChanged}
                                className={`w-full font-bold py-4 rounded-xl transition-all ${characterChanged
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 hover:bg-gray-600 text-white transform hover:scale-105'
                                    }`}
                            >
                                ← Close Settings
                            </button>
                            <button
                                onClick={handleSave}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Save & Reload Character
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Restart App
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
