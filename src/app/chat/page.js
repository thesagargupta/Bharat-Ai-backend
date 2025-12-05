"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ImageModal from "../../../components/ImageModal";
import {
  ChatSidebar,
  ChatHeader,
  WelcomeScreen,
  MessageList,
  ChatInput,
  DeleteChatModal,
  LoadingScreen,
  InitialMessageLoadingScreen,
  ChatLoadingFallback,
  ScrollToBottomButton
} from "../../../components/chat";
import {
  useUserProfile,
  useChats,
  useAutoScroll,
  useChatActions
} from "../../../hooks";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  // State management
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isImageGenMode, setIsImageGenMode] = useState(false);
  const [isProcessingInitialMessage, setIsProcessingInitialMessage] = useState(false);
  const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, chatId: null });

  // Custom hooks
  const { userAvatar, userName } = useUserProfile();
  const { chats, setChats, isLoadingChats } = useChats();
  const { scrollRef, typingRef, lastMessageRef, messagesEndRef, scrollToBottom, showScrollButton } = useAutoScroll(isTyping, messages);
  const { handleImageGeneration, handleSendMessage, loadChatMessages, deleteChat } = useChatActions(
    currentChatId, 
    setMessages, 
    setChats, 
    setCurrentChatId, 
    setIsTyping
  );

  // Refs
  const fileRef = useRef(null);
  const hasInitialized = useRef(false);
  
  // Authentication redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/chat");
    }
  }, [status, router]);

  // Load chat from URL if chatId is present
  useEffect(() => {
    const loadChatFromUrl = async () => {
      if (hasInitialized.current || !session?.user || isLoadingChats) return;
      
      const chatId = searchParams.get('chatId');
      if (chatId) {
        hasInitialized.current = true;
        window.dispatchEvent(new Event('topLoadingBar:start'));
        
        try {
          await loadChatMessages(chatId);
        } finally {
          window.dispatchEvent(new Event('topLoadingBar:complete'));
        }
      }
    };

    loadChatFromUrl();
  }, [searchParams, session, isLoadingChats, loadChatMessages]);

  // Handle initial message from URL
  useEffect(() => {
    const handleInitialMessage = async () => {
      if (hasInitialized.current || !session?.user) return;
      
      const initialMessage = searchParams.get('message');
      const chatId = searchParams.get('chatId');
      
      // Only process initial message if no chatId is present
      if (initialMessage && !chatId && !isLoadingChats) {
        hasInitialized.current = true;
        setIsProcessingInitialMessage(true);
        
        const tempUserMessage = {
          id: `temp-user-${Date.now()}`,
          role: "user",
          content: initialMessage,
          timestamp: new Date(),
        };
        
        setMessages([tempUserMessage]);
        setIsTyping(true);
        
        try {
          const response = await fetch('/api/chats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: initialMessage,
            }),
            // Add timeout for mobile networks
            signal: AbortSignal.timeout(60000),
          });

          if (response.ok) {
            const data = await response.json();
            
            const newChat = {
              id: data.chatId,
              title: data.chatTitle,
              messageCount: 2,
              lastMessage: data.assistantMessage.content.slice(0, 100),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            setChats(prev => [newChat, ...prev]);
            setCurrentChatId(data.chatId);
            setMessages([data.userMessage, data.assistantMessage]);
            
            // Update URL with chat ID
            if (typeof window !== 'undefined') {
              const url = new URL(window.location.href);
              url.searchParams.set('chatId', data.chatId);
              url.searchParams.delete('message');
              window.history.replaceState({}, '', url.pathname + url.search);
            }
          } else {
            setMessages([]);
            console.error('Error sending initial message');
          }
        } catch (error) {
          console.error('Error sending initial message:', error);
          setMessages([]);
        } finally {
          setIsTyping(false);
          setIsProcessingInitialMessage(false);
        }

        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('message');
          window.history.replaceState({}, '', url.pathname + url.search);
        }
      }
    };

    handleInitialMessage();
  }, [searchParams, session, isLoadingChats, setChats, setCurrentChatId]);

  // Removed auto-scroll on every message change - now handled in useAutoScroll hook

  // Show loading while authenticating
  if (status === "loading") {
    return <LoadingScreen />;
  }
  
  // Don't render until authenticated
  if (status === "unauthenticated") {
    return null;
  }

  // Event handlers
  const toggleTool = (id) => {
    if (id === "image-gen") {
      setIsImageGenMode(!isImageGenMode);
      if (!isImageGenMode) {
        setSelectedTools([]);
        setUploadedPreview(null);
      }
    } else {
      setIsImageGenMode(false);
      setSelectedTools((prev) => {
        if (prev.includes(id)) return prev.filter((p) => p !== id);
        return [...prev, id];
      });
    }
  };

  const handleUploadClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedPreview(url);
    setSelectedTools((prev) => (prev.includes("upload") ? prev : [...prev, "upload"]));
    e.target.value = "";
  };

  const removeTool = (tool) => {
    setSelectedTools((prev) => prev.filter((p) => p !== tool));
    if (tool === "upload") {
      if (uploadedPreview) {
        URL.revokeObjectURL(uploadedPreview);
        setUploadedPreview(null);
      }
    }
  };

  const exitImageGenMode = () => {
    setIsImageGenMode(false);
    setMessage('');
  };

  const handleImageClick = (imageUrl) => {
    setImageModal({
      isOpen: true,
      imageUrl
    });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, imageUrl: null });
  };

  const handleSend = async () => {
    if (!message.trim() && !uploadedPreview) return;

    const messageText = message.trim();
    setMessage("");
    
    // Enable auto-scroll for user's own message
    scrollToBottom(true, true);
    
    if (isImageGenMode) {
      await handleImageGeneration(messageText);
      setIsImageGenMode(false);
    } else {
      await handleSendMessage(messageText, uploadedPreview);
    }
    
    // Always clear uploaded preview and file input after sending
    if (uploadedPreview) {
      URL.revokeObjectURL(uploadedPreview);
      setUploadedPreview(null);
      setSelectedTools(prev => prev.filter(tool => tool !== "upload"));
    }
    
    // Clear file input to allow re-uploading the same file
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setUploadedPreview(null);
    setSelectedTools([]);
    setIsSidebarOpen(false);
    
    // Update URL to remove chatId
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('chatId');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  const handleSelectChat = async (chatId) => {
    if (chatId === currentChatId) {
      setIsSidebarOpen(false);
      return;
    }
    
    window.dispatchEvent(new Event('topLoadingBar:start'));
    
    try {
      await loadChatMessages(chatId);
      setUploadedPreview(null);
      setSelectedTools([]);
      setIsSidebarOpen(false);
      
      // Update URL with selected chat ID
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('chatId', chatId);
        window.history.replaceState({}, '', url.pathname + url.search);
      }
    } finally {
      window.dispatchEvent(new Event('topLoadingBar:complete'));
    }
  };

  const openDeleteModal = (chatId) => {
    setDeleteModal({ open: true, chatId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, chatId: null });
  };

  const confirmDeleteChat = async () => {
    const chatId = deleteModal.chatId;
    const success = await deleteChat(chatId);
    
    if (success) {
      const updatedChats = chats.filter((c) => c.id !== chatId);
      setChats(updatedChats);
      
      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          await loadChatMessages(updatedChats[0].id);
        } else {
          setCurrentChatId(null);
          setMessages([]);
        }
      }
    }
    
    closeDeleteModal();
  };

  return (
    <div className="h-[100dvh] bg-gray-50 flex relative overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={openDeleteModal}
        onOpenSettings={() => router.push('/setting')}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-full min-h-0">
        
        {/* Initial Loading Screen */}
        {isProcessingInitialMessage && messages.length === 1 && (
          <InitialMessageLoadingScreen />
        )}

        {/* Chat Header */}
        <ChatHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          onProfileClick={() => router.push('/profile')}
          userAvatar={userAvatar}
          userName={userName}
        />

        {/* Messages Area */}
        {messages.length === 0 && !isTyping ? (
          <WelcomeScreen />
        ) : (
          <>
            <MessageList
              messages={messages}
              isTyping={isTyping}
              typingRef={typingRef}
              lastMessageRef={lastMessageRef}
              messagesEndRef={messagesEndRef}
              scrollRef={scrollRef}
              onImageClick={handleImageClick}
            />
            
            {/* Scroll to Bottom Button */}
            <ScrollToBottomButton 
              show={showScrollButton} 
              onClick={() => scrollToBottom(true)} 
            />
          </>
        )}

        {/* Chat Input */}
        <ChatInput
          message={message}
          setMessage={setMessage}
          isTyping={isTyping}
          isImageGenMode={isImageGenMode}
          selectedTools={selectedTools}
          uploadedPreview={uploadedPreview}
          fileRef={fileRef}
          onSend={handleSend}
          onToggleTool={toggleTool}
          onUploadClick={handleUploadClick}
          onRemoveTool={removeTool}
          onExitImageGen={exitImageGenMode}
          onFileChange={handleFile}
        />
      </div>

      {/* Modals */}
      <DeleteChatModal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteChat}
      />

      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={closeImageModal}
        imageUrl={imageModal.imageUrl}
      />
    </div>
  );
}

// Main export with Suspense boundary
export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoadingFallback />}>
      <ChatContent />
    </Suspense>
  );
}
