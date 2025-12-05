"use client";
import { FiSend, FiX } from "react-icons/fi";
import ToolSelector from "../ToolSelector";

export default function ChatInput({ 
  message,
  setMessage,
  isTyping,
  isImageGenMode,
  selectedTools,
  uploadedPreview,
  fileRef,
  onSend,
  onToggleTool,
  onUploadClick,
  onRemoveTool,
  onExitImageGen,
  onFileChange
}) {
  return (
    <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-t border-gray-200">
      {/* Tools and Upload Preview */}
      <div className="px-4 sm:px-6 flex-shrink-0 pb-2 pt-2">
        <ToolSelector
          selected={isImageGenMode ? ["image-gen"] : selectedTools}
          onToggle={onToggleTool}
          onUploadClick={onUploadClick}
          onRemove={onRemoveTool}
          onExitImageGen={onExitImageGen}
        />

        {/* Image Generation Mode Indicator */}
        {isImageGenMode && (
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-purple-700">
                  🎨 Image Generation Mode Active
                </span>
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Type your image description in the message box below
            </p>
          </div>
        )}

        {uploadedPreview && (
          <div className="mt-4 flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="relative">
              <img 
                src={uploadedPreview} 
                alt="preview" 
                className="w-24 h-18 object-cover rounded-lg border border-white shadow-sm" 
              />
              <button
                onClick={() => onRemoveTool("upload")}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FiX size={10} />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Image attached</p>
              <p className="text-xs text-gray-500">Ready to analyze</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 sm:px-6 py-2 sm:py-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:pb-3">
        <div className="flex items-end gap-3">
          <div className="flex-1 min-w-0">
            <div className="bg-gray-100 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isTyping) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                disabled={isTyping}
                placeholder={
                  isTyping 
                    ? "AI is responding..." 
                    : isImageGenMode 
                      ? "🎨 Describe the image you want to generate..."
                      : "Message Bharat AI..."
                }
                rows={1}
                className={`w-full border-0 bg-transparent px-4 py-3 focus:outline-none resize-none text-gray-800 placeholder-gray-500 ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  minHeight: '48px',
                  maxHeight: '150px',
                }}
              />
            </div>
          </div>
          <button
            onClick={onSend}
            disabled={(!message.trim() && !uploadedPreview) || isTyping}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group flex-shrink-0"
            title={
              isTyping 
                ? "AI is responding..." 
                : isImageGenMode 
                  ? "Generate image"
                  : "Send message"
            }
          >
            {isTyping ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isImageGenMode ? (
              <div className="flex items-center gap-1">
                <span className="text-sm">🎨</span>
              </div>
            ) : (
              <FiSend size={20} className="group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
