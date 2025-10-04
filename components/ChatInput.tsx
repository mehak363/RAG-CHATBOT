
import React, { useState } from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [text, setText] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (text.trim()) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    return (
        <div className="p-6 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={disabled ? "Upload a PDF to start chatting" : "Ask a question about the document..."}
                    disabled={disabled}
                    className="flex-1 p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:cursor-not-allowed"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={disabled || !text.trim()}
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
