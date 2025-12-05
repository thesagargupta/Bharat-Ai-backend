"use client";
import { FiMessageSquare, FiSettings, FiX } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Image from "next/image";

export default function ChatSidebar({ 
  isOpen, 
  onClose, 
  chats, 
  currentChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat,
  onOpenSettings 
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="relative bg-white rounded-full p-2 shadow-lg">
                  <Image 
                    src="/logo.png" 
                    alt="Bharat AI Logo" 
                    width={40} 
                    height={40} 
                    className="rounded-full" 
                  />
                </div>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Bharat AI</h2>
                <p className="text-sm text-gray-500">AI Assistant</p>
              </div>
            </div>
            {/* Close button - Mobile Only */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <FiX size={24} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <button 
            onClick={onNewChat}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 mb-2"
            style={{ fontWeight: 500 }}
          >
            <FiMessageSquare size={16} />
            <span className="text-sm">New Chat</span>
          </button>
          {/* Thin grey line */}
          <div className="border-t border-gray-200 my-2" style={{ height: '1px' }} />
          {/* Chat list */}
          <div className="space-y-1">
            {chats.length === 0 && (
              <div className="text-xs text-gray-400 px-2 py-2">No chats yet</div>
            )}
            {chats.filter((chat, index, self) => 
              // Extra safety: filter duplicates at render time
              index === self.findIndex((c) => c.id === chat.id)
            ).map((chat) => (
              <div 
                key={chat.id} 
                className={`flex items-center group rounded-lg px-2 py-2 cursor-pointer ${currentChatId === chat.id ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'}`}
                onClick={() => onSelectChat(chat.id)}
                style={{ transition: 'background 0.2s' }}
              >
                <div className="flex-1 truncate">
                  <span className="text-sm text-gray-800 font-medium truncate">{chat.title || 'New Chat'}</span>
                  <div className="text-xs text-gray-500 truncate mt-1">{chat.lastMessage}</div>
                </div>
                <button
                  className="ml-2 p-1 rounded md:hover:bg-gray-200 text-gray-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  title="Delete chat"
                  onClick={e => { e.stopPropagation(); onDeleteChat(chat.id); }}
                >
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer - Settings */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={onOpenSettings}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
          >
            <FiSettings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>
    </>
  );
}
