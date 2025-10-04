
import React from 'react';
import { ChunkingStrategy } from '../types';

interface ChunkingStrategySelectorProps {
    selectedStrategy: ChunkingStrategy;
    onChange: (strategy: ChunkingStrategy) => void;
    disabled: boolean;
}

const strategies = [
    { id: ChunkingStrategy.Recursive, name: 'Recursive', description: 'Maintains semantic context by splitting hierarchically.' },
    { id: ChunkingStrategy.Fixed, name: 'Fixed-Size', description: 'Simple splitting into fixed-size chunks with overlap.' },
];

const ChunkingStrategySelector: React.FC<ChunkingStrategySelectorProps> = ({ selectedStrategy, onChange, disabled }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">1. Select Chunking Strategy</label>
            <div className="space-y-2">
                {strategies.map(strategy => (
                    <label
                        key={strategy.id}
                        className={`flex p-3 rounded-lg border-2 transition cursor-pointer ${
                            selectedStrategy === strategy.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        <input
                            type="radio"
                            name="chunking-strategy"
                            value={strategy.id}
                            checked={selectedStrategy === strategy.id}
                            onChange={() => onChange(strategy.id)}
                            className="hidden"
                            disabled={disabled}
                        />
                        <div>
                            <span className="font-semibold text-white">{strategy.name}</span>
                            <p className="text-xs text-gray-400">{strategy.description}</p>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ChunkingStrategySelector;
