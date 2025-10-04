
import { Chunk, ChunkingStrategy } from '../types';
import { 
    CHUNK_SIZE_FIXED, CHUNK_OVERLAP_FIXED,
    CHUNK_SIZE_RECURSIVE, CHUNK_OVERLAP_RECURSIVE 
} from '../constants';

const fixedSizeChunker = (text: string): Chunk[] => {
    const chunks: Chunk[] = [];
    let id = 0;
    for (let i = 0; i < text.length; i += CHUNK_SIZE_FIXED - CHUNK_OVERLAP_FIXED) {
        const chunkText = text.substring(i, i + CHUNK_SIZE_FIXED);
        chunks.push({ id: id++, text: chunkText });
    }
    return chunks;
};

const recursiveChunker = (text: string): Chunk[] => {
    const separators = ['\n\n', '\n', '. ', ' '];
    
    const splitText = (text: string, separatorIndex: number): string[] => {
        if (text.length <= CHUNK_SIZE_RECURSIVE) {
            return [text];
        }
        if (separatorIndex >= separators.length) {
            // If we've run out of separators, fallback to fixed-size chunking for this piece
            const subChunks: string[] = [];
            for (let i = 0; i < text.length; i += CHUNK_SIZE_RECURSIVE - CHUNK_OVERLAP_RECURSIVE) {
                subChunks.push(text.substring(i, i + CHUNK_SIZE_RECURSIVE));
            }
            return subChunks;
        }

        const separator = separators[separatorIndex];
        const parts = text.split(separator);
        const result: string[] = [];
        let currentChunk = '';

        for (const part of parts) {
            if (currentChunk.length + part.length + separator.length > CHUNK_SIZE_RECURSIVE) {
                if (currentChunk) {
                    result.push(...splitText(currentChunk, separatorIndex + 1));
                }
                currentChunk = part;
            } else {
                currentChunk += (currentChunk ? separator : '') + part;
            }
        }
        if (currentChunk) {
            result.push(...splitText(currentChunk, separatorIndex + 1));
        }

        return result;
    }

    const finalChunks = splitText(text, 0).filter(c => c.trim().length > 0);
    return finalChunks.map((chunkText, index) => ({ id: index, text: chunkText }));
};

export const chunkText = (text: string, strategy: ChunkingStrategy): Chunk[] => {
    switch (strategy) {
        case ChunkingStrategy.Fixed:
            return fixedSizeChunker(text);
        case ChunkingStrategy.Recursive:
            return recursiveChunker(text);
        default:
            throw new Error('Unknown chunking strategy');
    }
};
