
import React from 'react';
import { CloseIcon } from './icons';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 text-gray-200 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800">
                    <h2 className="text-xl font-bold">Project Report: PDF RAG Chatbot</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
                        <CloseIcon />
                    </button>
                </header>

                <main className="p-6 space-y-6">
                    <Section title="1. Approach">
                        <p>This application implements a Retrieval-Augmented Generation (RAG) pipeline entirely on the client-side. The goal is to allow a user to upload a PDF and ask questions about its content. Due to the browser environment limitations (no direct access to server-side vector databases like ChromaDB or Pinecone), the RAG process is simulated:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li><strong>PDF Parsing:</strong> The PDF.js library is used to extract raw text from the user's uploaded document directly in the browser.</li>
                            <li><strong>Chunking:</strong> The extracted text is divided into smaller, manageable chunks using one of two user-selectable strategies.</li>
                            <li><strong>In-Memory Storage:</strong> Chunks are stored in a simple array in the React application's state, acting as a temporary, in-memory "vector store".</li>
                            <li><strong>Retrieval:</strong> When a user asks a question, a basic keyword-matching algorithm retrieves the top 5 most relevant chunks from the in-memory store. This simulates the similarity search performed by a real vector database.</li>
                            <li><strong>Generation:</strong> The retrieved chunks (context) and the user's query are formatted into a prompt and sent to the Gemini API to generate a context-aware answer.</li>
                        </ul>
                    </Section>
                    
                    <Section title="2. Chunking Strategies Implemented">
                        <SubSection title="Fixed-Size Chunking">
                             <p>This is the simplest method. The text is split into chunks of a predefined size (e.g., 1000 characters) with a small overlap (e.g., 100 characters) to ensure context isn't completely lost at chunk boundaries.</p>
                             <ul className="list-disc list-inside mt-2 text-sm">
                                <li><strong>Pros:</strong> Simple and fast to implement.</li>
                                <li><strong>Cons:</strong> Can abruptly cut sentences or ideas, potentially breaking semantic meaning and leading to less effective retrieval.</li>
                             </ul>
                        </SubSection>
                        <SubSection title="Recursive Character Splitting">
                             <p>A more sophisticated approach. It attempts to split text along a hierarchy of separators, starting with the most semantically significant. The hierarchy used here is: paragraphs (`\n\n`), single newlines (`\n`), sentences (`. `), and finally, words (` `). It recursively splits until the chunks are below the desired size.</p>
                             <ul className="list-disc list-inside mt-2 text-sm">
                                <li><strong>Pros:</strong> More likely to keep semantically related content together (e.g., entire sentences or paragraphs), which generally leads to better context for the LLM.</li>
                                <li><strong>Cons:</strong> More complex to implement and computationally slightly more intensive than the fixed-size method.</li>
                             </ul>
                        </SubSection>
                    </Section>

                    <Section title="3. Lessons Learned & Future Improvements">
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Client-Side Limitations:</strong> Implementing a full RAG pipeline in the browser is challenging. Processing large PDFs can be memory-intensive, and the lack of a true vector database limits retrieval to simpler, less accurate methods. For a production system, a backend is essential for embedding generation and vector storage.</li>
                            <li><strong>Chunking is Crucial:</strong> The quality and relevance of the retrieved chunks directly determine the quality of the AI's answer. The recursive strategy consistently provides better context.</li>
                            <li><strong>UI/UX Matters:</strong> Clear state management (e.g., loading indicators for processing and thinking) is vital for a good user experience, especially with potentially long-running tasks like PDF parsing.</li>
                            <li><strong>Future Work:</strong>
                                <ul className="list-decimal list-inside ml-4 mt-1 text-sm">
                                    <li>Integrate with a backend to use a real embedding model and a vector database (e.g., Pinecone).</li>
                                    <li>Implement more advanced retrieval strategies, like hybrid search.</li>
                                    <li>Add source highlighting that shows the user exactly where in the original document the information came from.</li>
                                    <li>Support for multiple documents to be uploaded and queried simultaneously.</li>
                                </ul>
                            </li>
                        </ul>
                    </Section>
                </main>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
        <h3 className="text-lg font-semibold text-blue-400 mb-2">{title}</h3>
        <div className="text-gray-300 text-sm leading-relaxed">{children}</div>
    </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-4 pl-4 border-l-2 border-gray-700">
        <h4 className="font-semibold text-white">{title}</h4>
        <div className="text-gray-400">{children}</div>
    </div>
);


export default ReportModal;
