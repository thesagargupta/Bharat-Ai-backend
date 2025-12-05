"use client";
import { BiMenuAltLeft } from "react-icons/bi";
import { FiUser } from "react-icons/fi";

export default function ChatHeader({ 
  onMenuClick, 
  onProfileClick, 
  userAvatar, 
  userName 
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <BiMenuAltLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900">Chat with Bharat AI</h1>
            <p className="text-xs sm:text-sm text-gray-500">Online now</p>
          </div>
        </div>
        {/* User Avatar */}
        <button 
          onClick={onProfileClick}
          className="relative hover:opacity-80 transition-opacity group"
          title="View Profile"
        >
          {userAvatar ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-500 transition-colors bg-gray-100">
              <img
                src={userAvatar}
                alt={userName || "User"}
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                key={userAvatar}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200 group-hover:border-blue-500 transition-colors">
              <FiUser size={20} className="text-white" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
