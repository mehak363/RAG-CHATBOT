import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, MicrophoneIcon } from './icons';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);
    const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);

    useEffect(() => {
        // FIX: Cast window to `any` to access vendor-prefixed SpeechRecognition API
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSpeechRecognitionSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const speechToText = event.results[0][0].transcript;
                setText(prevText => (prevText ? prevText + ' ' : '') + speechToText);
            };

            recognition.onstart = () => {
                setIsRecording(true);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        } else {
             setIsSpeechRecognitionSupported(false);
        }
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (text.trim()) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    const handleMicClick = () => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    return (
        <div className="p-6 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={disabled ? "Upload a PDF to start chatting" : "Ask a question or use the mic..."}
                    disabled={disabled}
                    className="flex-1 p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:cursor-not-allowed"
                    autoComplete="off"
                />
                {isSpeechRecognitionSupported && (
                    <button
                        type="button"
                        onClick={handleMicClick}
                        disabled={disabled}
                        className={`p-3 rounded-full transition-colors ${
                            isRecording 
                                ? 'bg-red-500 text-white animate-pulse' 
                                : 'bg-gray-600 hover:bg-gray-500 text-white'
                        } disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50`}
                        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                        <MicrophoneIcon />
                    </button>
                )}
                <button
                    type="submit"
                    disabled={disabled || !text.trim()}
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                     aria-label="Send message"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;