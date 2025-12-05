"use client";
import { useState } from "react";
import { errorToast } from "../lib/toast";

export function useChatActions(currentChatId, setMessages, setChats, setCurrentChatId, setIsTyping) {
  
  const handleImageGeneration = async (prompt) => {
    setIsTyping(true);
    
    try {
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: `🎨 Generate image: ${prompt}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, tempUserMessage]);

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: 'stable-diffusion',
          size: '1024x1024'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `I've generated an image based on your prompt: "${prompt}"`,
          image: { url: data.image.url },
          timestamp: new Date(),
        };

        setMessages(prev => {
          const withoutTemp = prev.filter(msg => msg.id !== tempUserMessage.id);
          return [...withoutTemp, tempUserMessage, aiResponse];
        });

        try {
          const chatResponse = await fetch('/api/chats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `🎨 Generate image: ${prompt}`,
              chatId: currentChatId,
              generatedImageUrl: data.image.url,
            }),
          });

          if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            
            setMessages(prev => {
              const userMsg = {
                id: chatData.userMessage.id,
                role: chatData.userMessage.role,
                content: `🎨 Generate image: ${prompt}`,
                image: chatData.userMessage.image,
                timestamp: chatData.userMessage.timestamp,
              };
              const aiMsg = {
                id: chatData.assistantMessage.id,
                role: chatData.assistantMessage.role,
                content: `I've generated an image based on your prompt: "${prompt}"`,
                image: chatData.assistantMessage.image,
                timestamp: chatData.assistantMessage.timestamp,
              };
              
              const existingMessages = prev.filter(msg => 
                !msg.id.startsWith('temp-') && 
                !msg.id.startsWith('ai-') &&
                msg.id !== userMsg.id &&
                msg.id !== aiMsg.id
              );
              
              return [...existingMessages, userMsg, aiMsg];
            });

            if (chatData.isNewChat) {
              const newChat = {
                id: chatData.chatId,
                title: chatData.chatTitle,
                messageCount: 2,
                lastMessage: `Generated image: ${prompt.slice(0, 50)}...`,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              // Remove any existing chat with same ID to prevent duplicates
              setChats(prev => {
                const filtered = prev.filter(c => c.id !== chatData.chatId);
                return [newChat, ...filtered];
              });
              setCurrentChatId(chatData.chatId);
              
              // Update URL with new chat ID
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.set('chatId', chatData.chatId);
                window.history.replaceState({}, '', url.pathname + url.search);
              }
            } else {
              setChats(prev => prev.map(chat => 
                chat.id === currentChatId 
                  ? {
                      ...chat,
                      messageCount: chat.messageCount + 2,
                      lastMessage: `Generated image: ${prompt.slice(0, 50)}...`,
                      updatedAt: new Date(),
                    }
                  : chat
              ));
            }
          }
        } catch (saveError) {
          console.error('Error saving to chat:', saveError);
        }

        return { success: true, chatId: chatData?.chatId || currentChatId }; // Success
      } else {
        const errorData = await response.json();
        setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
        errorToast(errorData.error || 'Failed to generate image');
        return { success: false };
      }

    } catch (error) {
      console.error('Error generating image:', error);
      setMessages(prev => prev.filter(msg => msg.id.startsWith('temp-')));
      errorToast('An error occurred while generating the image.');
      return { success: false };
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (messageText, uploadedPreview) => {
    if (!messageText.trim() && !uploadedPreview) return false;

    setIsTyping(true);
    
    try {
      let imageData = null;
      if (uploadedPreview) {
        try {
          const response = await fetch(uploadedPreview);
          const blob = await response.blob();
          
          // Convert blob to base64 using browser-compatible method
          // This works on all devices including mobile phones
          const base64String = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              // Remove the data URL prefix (e.g., "data:image/png;base64,")
              const base64 = reader.result.split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          
          imageData = {
            data: base64String,
            type: blob.type,
          };
        } catch (imageError) {
          console.error('Error processing image:', imageError);
          errorToast('Failed to process image. Please try again.');
          setIsTyping(false);
          return { success: false };
        }
      }

      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: messageText,
        image: uploadedPreview ? { url: uploadedPreview } : undefined,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, tempUserMessage]);

      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          chatId: currentChatId,
          imageData: imageData,
        }),
        // Add timeout for mobile networks (60 seconds)
        signal: AbortSignal.timeout(60000),
      });

      if (response.ok) {
        const data = await response.json();
        
        setMessages(prev => {
          const withoutTemp = prev.filter(msg => 
            msg.id !== tempUserMessage.id && 
            msg.id !== data.userMessage.id && 
            msg.id !== data.assistantMessage.id
          );
          return [...withoutTemp, data.userMessage, data.assistantMessage];
        });

        if (data.isNewChat) {
          const newChat = {
            id: data.chatId,
            title: data.chatTitle,
            messageCount: 2,
            lastMessage: data.assistantMessage.content.slice(0, 100),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          // Remove any existing chat with same ID to prevent duplicates
          setChats(prev => {
            const filtered = prev.filter(c => c.id !== data.chatId);
            return [newChat, ...filtered];
          });
          setCurrentChatId(data.chatId);
          
          // Update URL with new chat ID
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('chatId', data.chatId);
            window.history.replaceState({}, '', url.pathname + url.search);
          }
        } else {
          setChats(prev => prev.map(chat => 
            chat.id === data.chatId 
              ? {
                  ...chat,
                  messageCount: chat.messageCount + 2,
                  lastMessage: data.assistantMessage.content.slice(0, 100),
                  updatedAt: new Date(),
                }
              : chat
          ));
        }
        return { success: true, chatId: data.chatId, isNewChat: data.isNewChat };
      } else {
        // Get more detailed error message
        let errorMessage = 'Failed to send message. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If JSON parsing fails, use default message
        }
        
        setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
        errorToast(errorMessage);
        return { success: false };
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id.startsWith('temp-')));
      
      // Provide more specific error messages
      let errorMessage = 'An error occurred while sending your message.';
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      errorToast(errorMessage);
      return { success: false };
    } finally {
      setIsTyping(false);
    }
  };

  const loadChatMessages = async (chatId) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentChatId(chatId);
        setMessages(data.chat.messages);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading chat messages:', error);
      return false;
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await fetch(`/api/chats?chatId=${chatId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        return true;
      } else {
        errorToast('Failed to delete chat. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      errorToast('An error occurred while deleting the chat.');
      return false;
    }
  };

  return {
    handleImageGeneration,
    handleSendMessage,
    loadChatMessages,
    deleteChat
  };
}
