
import React, { useState, useCallback, useMemo } from 'react';
import { Message, ChunkingStrategy, Chunk, Author } from './types';
import { processPdf } from './services/pdfProcessor';
import { chunkText } from './services/textChunker';
import { generateAnswer } from './services/geminiService';
import PdfUpload from './components/PdfUpload';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import ChunkingStrategySelector from './components/ChunkingStrategySelector';
import ReportModal from './components/ReportModal';
import { DocumentIcon, InfoIcon, ThinkingIcon } from './components/icons';

const App: React.FC = () => {
    const [pdfText, setPdfText] = useState<string | null>(null);
    const [pdfName, setPdfName] = useState<string | null>(null);
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chunkingStrategy, setChunkingStrategy] = useState<ChunkingStrategy>(ChunkingStrategy.Recursive);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = useCallback(async (file: File) => {
        setIsProcessing(true);
        setError(null);
        setPdfText(null);
        setChunks([]);
        setMessages([]);
        setPdfName(null);

        try {
            const text = await processPdf(file);
            const newChunks = chunkText(text, chunkingStrategy);

            setPdfText(text);
            setChunks(newChunks);
            setPdfName(file.name);
            setMessages([{
                author: Author.AI,
                text: `Successfully processed "${file.name}". I'm ready to answer your questions.`,
            }]);
        } catch (err) {
            setError('Failed to process PDF. Please try another file.');
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    }, [chunkingStrategy]);

    const retrieveRelevantChunks = useCallback((query: string, allChunks: Chunk[]): Chunk[] => {
        const queryWords = new Set(query.toLowerCase().split(/\s+/).filter(w => w.length > 2));
        if (queryWords.size === 0) return [];

        const scoredChunks = allChunks.map(chunk => {
            const chunkWords = new Set(chunk.text.toLowerCase().split(/\s+/));
            const intersection = new Set([...queryWords].filter(x => chunkWords.has(x)));
            return { ...chunk, score: intersection.size };
        });

        scoredChunks.sort((a, b) => b.score - a.score);

        return scoredChunks.slice(0, 5).filter(c => c.score > 0);
    }, []);

    const handleSendMessage = useCallback(async (text: string) => {
        const userMessage: Message = { author: Author.User, text };
        setMessages(prev => [...prev, userMessage]);
        setIsThinking(true);
        setError(null);

        try {
            const relevantChunks = retrieveRelevantChunks(text, chunks);
            const context = relevantChunks.map(c => c.text).join('\n---\n');
            const answer = await generateAnswer(text, context);
            
            const aiMessage: Message = {
                author: Author.AI,
                text: answer,
                sources: relevantChunks
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            const errorMessage: Message = {
                author: Author.AI,
                text: "Sorry, I encountered an error trying to generate a response. Please check your API key and try again."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsThinking(false);
        }
    }, [chunks, retrieveRelevantChunks]);

    const appState = useMemo(() => {
        if (isProcessing) return 'processing';
        if (pdfText) return 'ready';
        return 'initial';
    }, [isProcessing, pdfText]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
            <aside className="w-1/4 min-w-[300px] max-w-[400px] bg-gray-800 p-6 flex flex-col justify-between border-r border-gray-700">
                <div>
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-white">PDF RAG Chatbot</h1>
                        <p className="text-sm text-gray-400">Your document inquiry assistant</p>
                    </header>

                    <div className="space-y-6">
                        <ChunkingStrategySelector
                            selectedStrategy={chunkingStrategy}
                            onChange={setChunkingStrategy}
                            disabled={appState !== 'initial'}
                        />
                        <PdfUpload onFileSelect={handleFileSelect} disabled={appState === 'processing'} />
                    </div>

                    {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
                    
                    {appState === 'processing' && (
                        <div className="mt-4 flex items-center text-blue-400">
                            <ThinkingIcon className="animate-spin mr-2" />
                            <span>Processing PDF...</span>
                        </div>
                    )}
                    
                    {pdfName && appState === 'ready' && (
                         <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center text-green-400">
                                <DocumentIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="font-semibold truncate" title={pdfName}>{pdfName}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{chunks.length} chunks created.</p>
                        </div>
                    )}
                </div>

                <footer className="text-center">
                    <button 
                        onClick={() => setIsReportModalOpen(true)}
                        className="w-full flex items-center justify-center py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm"
                    >
                        <InfoIcon className="w-4 h-4 mr-2" />
                        About this Project
                    </button>
                </footer>
            </aside>
            
            <main className="flex-1 flex flex-col">
                <ChatWindow messages={messages} isThinking={isThinking} state={appState} />
                <ChatInput onSendMessage={handleSendMessage} disabled={appState !== 'ready' || isThinking} />
            </main>

            <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
        </div>
    );
};

export default App;
