"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiSend, FiUpload, FiMessageSquare, FiImage } from "react-icons/fi";
import BharatAiLogo from "./logo";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // ALL HOOKS MUST BE AT THE TOP - Before any conditional returns
  const [message, setMessage] = useState("");
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [hasExistingChats, setHasExistingChats] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileRef = useRef(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Auto-redirect users with existing chats to chat page (like ChatGPT)
  useEffect(() => {
    const checkExistingChats = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/chats');
          if (response.ok) {
            const data = await response.json();
            // If user has existing chats, set state and redirect
            if (data.chats && data.chats.length > 0) {
              setHasExistingChats(true);
              // Redirect after a short delay to allow user to see the option
              setTimeout(() => {
                router.push('/chat');
              }, 2000);
            }
          }
        } catch (error) {
          console.error('Error checking existing chats:', error);
          // Don't redirect on error, let user stay on home page
        }
      }
    };

    // Add a small delay to prevent flash  
    const timer = setTimeout(checkExistingChats, 500);
    return () => clearTimeout(timer);
  }, [session, router]);
  
  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Don't render content until authenticated
  if (status === "unauthenticated") {
    return null;
  }

  function handleUploadClick() {
    if (fileRef.current) fileRef.current.click();
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedPreview(url);
    e.target.value = "";
  }

  function handleSend() {
    if (!message.trim() && !uploadedPreview) return;
    
    setIsSending(true);
    
    // Navigate to chat page with the message
    const queryParams = new URLSearchParams();
    if (message.trim()) queryParams.set('message', message.trim());
    if (uploadedPreview) queryParams.set('hasImage', 'true');
    
    router.push(`/chat?${queryParams.toString()}`);
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Bharat AI",
    "applicationCategory": "Artificial Intelligence",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "author": {
      "@type": "Person",
      "name": "Sagar Gupta"
    },
    "description": "Advanced AI assistant made in India. Experience intelligent chat, image analysis, web search, and powerful AI tools.",
    "url": "https://thebharatai.vercel.app"
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col relative overflow-y-auto">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        {/* Loading Overlay */}
        {isSending && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Starting your chat...</h2>
              <p className="text-gray-600">Taking you to BharatAI chat interface</p>
            </div>
          </div>
        )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pb-32 sm:pb-0">
        
        {/* Existing Chats Notification */}
        {hasExistingChats && (
          <div className="w-full max-w-2xl mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiMessageSquare className="text-blue-600" size={20} />
                  <div>
                    <p className="text-blue-800 font-medium">Welcome back!</p>
                    <p className="text-blue-600 text-sm">Continue your previous conversations or start a new one.</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/chat')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Continue Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logo and Branding */}
        <div className="text-center mb-12">
          <div className="flex justify-center mt-5 mb-6">
            <BharatAiLogo size="lg"/>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your intelligent AI assistant powered by advanced machine learning. 
            Ask questions, generate content, analyze images, and explore ideas.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FiMessageSquare className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Intelligent Conversations</h3>
            <p className="text-gray-600 text-sm">Engage in natural, context-aware conversations on any topic.</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FiImage className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Image Analysis</h3>
            <p className="text-gray-600 text-sm">Upload and analyze images with advanced AI vision capabilities.</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FiUpload className="text-white" size={24} />
              </div>
            <h3 className="font-semibold text-gray-900 mb-2">File Processing</h3>
            <p className="text-gray-600 text-sm">Upload and process various file types for analysis and insights.</p>
          </div>
        </div>

        {/* Input Area: Desktop/Tablet (>=sm) */}
        <div className="w-full max-w-3xl hidden sm:block mt-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="Message Bharat AI..."
                  className="w-full border-0 rounded-xl px-4 py-4 focus:outline-none text-gray-700 placeholder-gray-500 text-lg bg-transparent"
                />
              </div>
              <button
                onClick={handleUploadClick}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                title="Upload file"
              >
                <FiUpload size={20} />
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
                title={isSending ? "Starting chat..." : "Send message"}
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSend size={20} className="group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            </div>
          </div>
          {/* Info Texts: Desktop/Tablet - below input */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Bharat AI can make mistakes. Consider checking important information.
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Made With ❤️ by{" "}
            <a 
              href="https://sagarguptaportfolio.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
              style={{ textDecoration: 'none' }}
            >
              Sagar Gupta
            </a>
          </p>
        </div>

        {/* Info Texts: Mobile - below cards, above fixed input */}
        <div className="w-full max-w-3xl mx-auto sm:hidden px-6">
          <p className="text-center text-sm text-gray-500 ">
            Bharat AI can make mistakes. <br />Consider checking important information.
          </p>
          <p className="text-center text-sm text-gray-500 mt-3">
            Made With ❤️ by{" "}
            <a 
              href="https://sagarguptaportfolio.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
              style={{ textDecoration: 'none' }}
            >
              Sagar Gupta
            </a>
          </p>
        </div>

      </div>

      {/* Input Area: Mobile (<sm) sticky at bottom */}
      <div className="w-full max-w-3xl mx-auto sm:hidden" style={{position:'fixed',left:0,right:0,bottom:0,zIndex:20,width:'100%',maxWidth:'100vw',background:'rgba(255,255,255,0.95)',boxShadow:'0 -2px 16px rgba(0,0,0,0.04)',borderTop:'1px solid #e5e7eb',padding:'8px 0',backdropFilter:'blur(8px)'}}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-2 mx-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Message Bharat AI..."
                className="w-full border-0 rounded-xl px-4 py-4 focus:outline-none text-gray-700 placeholder-gray-500 text-lg bg-transparent"
              />
            </div>
            <button
              onClick={handleUploadClick}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              title="Upload file"
            >
              <FiUpload size={20} />
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              title={isSending ? "Starting chat..." : "Send message"}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiSend size={20} className="group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      </div>
    </>
  );
}
