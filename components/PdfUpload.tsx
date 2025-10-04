
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface PdfUploadProps {
    onFileSelect: (file: File) => void;
    disabled: boolean;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onFileSelect, disabled }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">2. Upload PDF</label>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
                disabled={disabled}
            />
            <button
                onClick={handleClick}
                disabled={disabled}
                className="w-full flex items-center justify-center py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
                <UploadIcon className="mr-2" />
                Select PDF File
            </button>
        </div>
    );
};

export default PdfUpload;
