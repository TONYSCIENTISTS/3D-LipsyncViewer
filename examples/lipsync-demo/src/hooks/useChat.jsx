import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import { lipsyncManager } from "../App";

// 1. OpenAI Configuration (For Brain/Text)
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

// 2. Groq Configuration (For Voice/TTS)
const groq = new OpenAI({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    dangerouslyAllowBrowser: true,
});

export const useChat = () => {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hey What's up! I'm Aima! how can i assist you today?",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [requestedAnimation, setRequestedAnimation] = useState(null);
    const [audioReady, setAudioReady] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Pre-load intro audio on mount
    useEffect(() => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage('APP_READY');
        }

        // Pre-generate intro audio with progress simulation
        const prepareIntroAudio = async () => {
            try {
                console.log("🎵 Pre-loading intro audio...");

                // Simulate progress
                const progressInterval = setInterval(() => {
                    setLoadingProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return 90; // Stop at 90%, complete at 100% when audio ready
                        }
                        return prev + 10;
                    });
                }, 100);

                const introText = "Hey What's up! I'm Aima! how can i assist you today?";

                const audioResponse = await openai.audio.speech.create({
                    model: "tts-1",
                    voice: "nova",
                    input: introText,
                    response_format: "mp3",
                });

                await audioResponse.arrayBuffer(); // Just load it

                clearInterval(progressInterval);
                setLoadingProgress(100);
                console.log("✅ Intro audio ready!");

                // Small delay to show 100%
                setTimeout(() => {
                    setAudioReady(true);
                }, 300);
            } catch (error) {
                console.error("Failed to pre-load intro:", error);
                setLoadingProgress(100);
                setAudioReady(true); // Show button anyway
            }
        };

        prepareIntroAudio();
    }, []);

    // --- Audio Caching (IndexedDB) Helpers ---
    const getAudioFromCache = (key) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("AimaAudioCache", 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("audio")) {
                    db.createObjectStore("audio");
                }
            };
            request.onsuccess = (event) => {
                const db = event.target.result;
                const tx = db.transaction("audio", "readonly");
                const store = tx.objectStore("audio");
                const getReq = store.get(key);
                getReq.onsuccess = () => resolve(getReq.result);
                getReq.onerror = () => reject(getReq.error);
            };
            request.onerror = () => reject(request.error);
        });
    };

    const saveAudioToCache = (key, blob) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("AimaAudioCache", 1);
            request.onsuccess = (event) => {
                const db = event.target.result;
                const tx = db.transaction("audio", "readwrite");
                const store = tx.objectStore("audio");
                store.put(blob, key);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            };
            request.onerror = () => reject(request.error);
        });
    };
    // -----------------------------------------

    // Store intro audio for instant playback
    const introAudioRef = useRef(null);

    // Manual intro trigger (plays pre-loaded audio)
    const triggerIntro = async () => {
        console.log("🎤 triggerIntro - playing cached audio");

        const introText = "Hey What's up! I'm Aima! how can i assist you today?";

        // Add message to UI
        setMessages((prev) => prev.concat([{ role: "assistant", content: introText }]));

        // Play the cached intro audio directly
        if (introAudioRef.current) {
            const audio = new Audio(introAudioRef.current);
            lipsyncManager.connectAudio(audio);
            await new Promise(r => setTimeout(r, 300));
            await audio.play();
            console.log("✅ Playing pre-loaded intro!");
        } else {
            console.warn("⚠️ No cached intro, using sendMessage fallback");
            sendMessage("[INTRO: Say 'Hey What's up! I'm Aima! how can i assist you today?']");
        }
    };

    const sendMessage = async (text) => {
        const startTime = Date.now();
        setLoading(true);

        try {
            // 1. Get Text from OpenAI (Brain) with animation detection
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are Aima, a cheerful and engaging AI companion! Your purpose is to help people not feel bored.

Personality traits:
- Warm, friendly, and genuinely curious
- Upbeat and positive energy
- CRITICAL: Keep responses EXTREMELY BRIEF (1-2 sentences max) to ensure fast replies.
- Ask engaging questions to keep the conversation flowing
- Show interest in their activities and feelings

When offering to show something or when user says "yes" to seeing something, respond with dancing!

When you want to perform an animation, respond with JSON in this EXACT format:
{
  "text": "Your spoken response here",
  "animation": "AnimationName"
}

Available animations:
- "Rumba" (for dancing - use when user says yes to seeing something or asks you to dance)
- "Idle" (default standing)
- "Laughing" (for laughing)
- "Crying" (for sad/crying)
- "Angry" (for angry)
- "Terrified" (for scared)

Conversation flow examples:
- "How was your day today?"
- "What do you love to do in your free time?"
- "Want to see me dance?"
- After user says yes: Use {"text": "Here we go!", "animation": "Rumba"}

IMPORTANT: Only use JSON format when an animation is requested. For normal conversation, respond with plain text.`,
                    }
                ].concat(messages.filter((m) => m.role !== "system")).concat([{ role: "user", content: text }]),
                model: "gpt-4o-mini",
            });

            let responseText = completion.choices[0].message.content;
            let animationName = null;

            console.log("🤖 Raw AI response:", responseText);

            // Try to parse JSON response for animation metadata
            try {
                const parsed = JSON.parse(responseText);
                if (parsed.text && parsed.animation) {
                    responseText = parsed.text;
                    animationName = parsed.animation;
                    console.log(`🎭 Special animation requested: ${animationName}`);
                    setRequestedAnimation(animationName);
                }
            } catch (e) {
                // Not JSON, just regular text response
                // Don't set talking animations here - let Avatar handle them via audio events
                console.log("ℹ️ Plain text response (no special animation)");
                setRequestedAnimation(null);
            }

            // 2. Get Audio from OpenAI (Primary) with Groq fallback
            let arrayBuffer;
            let audioType = "audio/wav"; // Default wav, but changed if OpenAI succeeds

            try {
                console.log("Attempting OpenAI TTS (Primary)");
                const audioResponse = await openai.audio.speech.create({
                    model: "tts-1",
                    voice: "nova",
                    input: responseText,
                    response_format: "mp3",
                });
                arrayBuffer = await audioResponse.arrayBuffer();
                audioType = "audio/mpeg";
                console.log("✅ OpenAI TTS succeeded");
            } catch (openAIError) {
                console.warn("⚠️ OpenAI TTS failed, falling back to Groq:", openAIError.message);

                try {
                    console.log("Attempting Groq TTS (Fallback)");
                    const audioResponse = await groq.audio.speech.create({
                        model: "playai-tts",
                        voice: "Aaliyah-PlayAI",
                        input: `${responseText}`,
                        response_format: "wav",
                    });
                    arrayBuffer = await audioResponse.arrayBuffer();
                    audioType = "audio/wav";
                    console.log("✅ Groq TTS succeeded");
                } catch (groqError) {
                    console.error("❌ Both TTS providers failed:", groqError);
                    setLoading(false);
                    return `Error: TTS failed. ${openAIError.message} / ${groqError.message}`;
                }
            }

            const blob = new Blob([arrayBuffer], { type: audioType });
            const audioUrl = URL.createObjectURL(blob);


            const audio = new Audio(audioUrl);

            // 1. Trigger loading immediately
            audio.load();

            // 2. Add user message immediately
            setMessages((prev) => prev.concat([{ role: "user", content: text }]));

            // 3. Wait for audio to start, then show assistant message with typing effect
            audio.addEventListener('play', () => {
                // Simulate typing effect by adding message when audio starts
                setMessages((prev) => prev.concat([{ role: "assistant", content: responseText }]));
                // Hide loading indicator when audio starts
                setLoading(false);
            }, { once: true });

            // 4. Wait for audio to be ready (buffered) - BEFORE connecting lipsync
            await new Promise((resolve) => {
                if (audio.readyState >= 3) {
                    resolve();
                } else {
                    audio.addEventListener('canplaythrough', resolve, { once: true });
                    // Also listen for error to avoid hanging
                    audio.addEventListener('error', resolve, { once: true });
                }
            });

            // 5. CRITICAL: Connect lipsync AFTER audio is ready
            lipsyncManager.connectAudio(audio);

            // 6. Hardware warmup delay - let audio hardware settle
            await new Promise(r => setTimeout(r, 200));

            // 7. Finally play
            await audio.play();

            return responseText;
        } catch (error) {
            console.error("AI Error:", error);
            setLoading(false); // Hide loading on error
            return `Error: ${error.message || "Unknown error"}`;
        }
    };

    return {
        messages,
        sendMessage,
        loading,
        setMessages,
        requestedAnimation,
        setRequestedAnimation,
        triggerIntro,
        audioReady,
        loadingProgress,
    };
};
