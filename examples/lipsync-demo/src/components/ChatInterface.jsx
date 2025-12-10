import { useRef, useState, useEffect } from "react";

export const ChatInterface = ({ onMessageSent }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hey What's up! I'm Aima! how can i assist you today?",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => prev.concat([{ role: "user", content: userMessage }]));
        setIsLoading(true);

        // Call the parent handler (which will eventually call the API)
        onMessageSent(userMessage)
            .then((response) => {
                setMessages((prev) => prev.concat([{ role: "assistant", content: response }]));
            })
            .catch((error) => {
                console.error("Chat error:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });

        // Blur to reset layout (fix for Android keyboard issue)
        inputRef.current?.blur();
    };

    return (
        <div className="fixed bottom-0 left-0 w-full p-4 pointer-events-none z-50 flex flex-col items-center">
            <div className="w-full max-w-3xl flex flex-col gap-4">
                {/* Messages History (Fade out at top) */}
                <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-auto pointer-events-auto p-4 mask-fade-top">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl backdrop-blur-md ${msg.role === "user"
                                    ? "bg-white/20 text-white rounded-tr-none"
                                    : "bg-black/40 text-white rounded-tl-none border border-white/10"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}<div ref={messagesEndRef} />
                </div>

                {/* Input Bar - Moves up when focused */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full pointer-events-auto flex gap-2 relative transition-all duration-300"
                    style={{ bottom: isFocused ? '50vh' : '0' }}
                >
                    <input
                        ref={inputRef}
                        className="flex-1 bg-black/30 backdrop-blur-md text-white placeholder-white/50 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Type a message"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isLoading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600 shadow-lg hover:scale-105"
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="white"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                />
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
