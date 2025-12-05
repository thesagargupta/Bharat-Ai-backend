"use client";
import ChatMessage from "../ChatMessage";

export default function MessageList({ 
  messages, 
  isTyping, 
  typingRef, 
  lastMessageRef,
  messagesEndRef,
  scrollRef,
  onImageClick 
}) {
  // Deduplicate messages by ID - keep the last occurrence
  const uniqueMessages = [];
  const seenIds = new Set();
  
  // Iterate in reverse to keep the most recent version of each message
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (!seenIds.has(msg.id)) {
      seenIds.add(msg.id);
      uniqueMessages.unshift(msg);
    }
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 space-y-4"
      style={{ minHeight: 0, WebkitOverflowScrolling: 'touch' }}
    >
      {uniqueMessages.map((m, index) => {
        const isLastMessage = index === uniqueMessages.length - 1;
        const isLastAIMessage = isLastMessage && m.role === 'assistant';
        
        return (
          <div 
            key={m.id} 
            className="animate-fadeIn"
            ref={isLastAIMessage ? lastMessageRef : null}
          >
            <ChatMessage 
              msg={{
                role: m.role,
                text: m.content,
                image: m.image,
                id: m.id
              }} 
              onImageClick={onImageClick}
            />
          </div>
        );
      })}
      
      {/* Typing Animation */}
      {isTyping && (
        <div ref={typingRef} className="animate-fadeIn">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 ai-avatar-typing flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl px-4 py-4 shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full typing-dot"></div>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">BharatAI is thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Invisible anchor for scroll-to-bottom */}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
}
