
export enum Author {
    User = 'user',
    AI = 'ai',
}

export interface Message {
    author: Author;
    text: string;
    sources?: Chunk[];
}

export interface Chunk {
    id: number;
    text: string;
}

export enum ChunkingStrategy {
    Fixed = 'fixed',
    Recursive = 'recursive',
}
