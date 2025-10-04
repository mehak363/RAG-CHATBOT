
import React, { useRef, useEffect } from 'react';
import { Message, Author } from '../types';
import { DocumentIcon, ThinkingIcon, UserIcon, BotIcon, ChevronDownIcon } from './icons';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.author === Author.User;
    const [sourcesVisible, setSourcesVisible] = React.useState(false);

    return (
        <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}>
             {!isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"><BotIcon /></div>}
            
            <div className={`max-w-xl p-4 rounded-lg ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.sources && message.sources.length > 0 && (
                     <div className="mt-3 border-t border-gray-600 pt-3">
                        <button onClick={() => setSourcesVisible(!sourcesVisible)} className="flex items-center text-xs text-gray-400 hover:text-white transition">
                            {sourcesVisible ? 'Hide' : 'Show'} Sources ({message.sources.length})
                            <ChevronDownIcon className={`w-4 h-4 ml-1 transform transition-transform ${sourcesVisible ? 'rotate-180' : ''}`} />
                        </button>
                        {sourcesVisible && (
                             <div className="mt-2 space-y-2">
                                {message.sources.map(source => (
                                    <div key={source.id} className="p-2 bg-gray-800 rounded text-xs text-gray-300">
                                        <p className="font-bold">Chunk {source.id + 1}</p>
                                        <p className="truncate ...">{source.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
             {isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"><UserIcon /></div>}
        </div>
    );
};


interface ChatWindowProps {
    messages: Message[];
    isThinking: boolean;
    state: 'initial' | 'processing' | 'ready';
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isThinking, state }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);
    
    const InitialStateMessage = () => (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <DocumentIcon className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Welcome to the PDF Chatbot</h2>
            <p>Upload a PDF document to get started.</p>
        </div>
    );

    return (
        <div className="flex-1 p-6 overflow-y-auto">
             {state === 'initial' && messages.length === 0 && <InitialStateMessage />}
            {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
            {isThinking && (
                 <div className="flex items-start gap-4 my-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"><BotIcon /></div>
                    <div className="max-w-xl p-4 rounded-lg bg-gray-700 text-gray-200 rounded-bl-none">
                        <div className="flex items-center">
                            <ThinkingIcon className="animate-spin mr-2" />
                            <span>Thinking...</span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default ChatWindow;
