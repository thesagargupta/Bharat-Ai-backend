"use client";
import Image from "next/image";
import { FiMessageSquare, FiImage, FiUpload, FiSettings, FiSend } from "react-icons/fi";

export default function WelcomeScreen() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px] md:min-h-[400px] px-4" style={{ zoom: '0.8' }}>
      <div className="text-center max-w-4xl mx-auto py-4 md:py-8 animate-fadeIn w-full">
        {/* Gradient Logo/Icon */}
        <div className="mb-6 md:mb-8 relative">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-orange-500 via-yellow-600 to-green-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl md:shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Image 
              src="/world.svg" 
              alt="Bharat AI Logo" 
              width={40} 
              height={40} 
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </div>
          {/* Animated rings */}
          <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 mx-auto border-4 border-blue-200 rounded-2xl md:rounded-3xl animate-ping opacity-20"></div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient px-4">
          Welcome to Bharat AI
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 md:mb-8 font-medium px-4">
          How can I help you today?
        </p>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-12 max-w-5xl mx-auto px-2">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
            <div className="mb-2 md:mb-3 text-blue-600 group-hover:scale-110 transition-transform flex justify-center">
              <FiMessageSquare className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Get instant answers</h3>
            <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Ask me anything and get intelligent responses</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
            <div className="mb-2 md:mb-3 text-purple-600 group-hover:scale-110 transition-transform flex justify-center">
              <FiImage className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Generate images</h3>
            <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Create stunning AI-generated artwork</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
            <div className="mb-2 md:mb-3 text-green-600 group-hover:scale-110 transition-transform flex justify-center">
              <FiUpload className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Analyze images</h3>
            <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Upload photos for AI-powered analysis</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
            <div className="mb-2 md:mb-3 text-orange-600 group-hover:scale-110 transition-transform flex justify-center">
              <FiSettings className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Smart conversations</h3>
            <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Context-aware chat that remembers everything</p>
          </div>
        </div>

        {/* Subtle hint */}
        <div className="mt-8 md:mt-12 flex items-center justify-center gap-2 text-gray-400 text-xs md:text-sm">
          <FiSend className="w-4 h-4 animate-bounce" />
          <span className="hidden sm:inline">Start by typing a message below</span>
          <span className="sm:hidden">Type a message to start</span>
        </div>
      </div>
    </div>
  );
}
