"use client";
import { useState, useEffect } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

export default function ImageModal({ isOpen, onClose, imageUrl, imageData = {} }) {
  const [isLoading, setIsLoading] = useState(true);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `bharat-ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback - open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  console.log('ImageModal rendering with:', { isOpen, imageUrl });

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-black/50 rounded-lg px-3 py-2 text-white">
          <span className="text-sm font-medium">Generated Image</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Action Controls */}
          <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1">
            <button
              onClick={handleDownload}
              className="p-2 text-white hover:bg-white/20 rounded transition-colors"
              title="Download Image"
            >
              <FiDownload size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-red-500/20 rounded transition-colors"
              title="Close (Esc)"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div 
        className="relative flex items-center justify-center w-full h-full p-4 pt-20 pb-16"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative max-w-full max-h-full overflow-hidden">
          <img
            src={imageUrl}
            alt="Generated image"
            className="max-w-[90vw] max-h-[70vh] object-contain cursor-pointer"
            onLoad={() => setIsLoading(false)}
            onDoubleClick={onClose}
            draggable={false}
          />
          
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 right-4 bg-black/50 rounded-lg px-3 py-2 text-white text-xs opacity-75">
        <kbd className="bg-white/20 px-1 rounded mr-1">Esc</kbd>Close
        <span className="ml-2">Double-click to close</span>
      </div>
    </div>
  );
}