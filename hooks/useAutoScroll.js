"use client";
import { useEffect, useRef, useState } from "react";

export function useAutoScroll(isTyping, messages) {
  const typingRef = useRef(null);
  const lastMessageRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const lastScrollHeightRef = useRef(0);
  const shouldAutoScrollRef = useRef(false); // Only true when user sends message

  // Detect scroll position and show/hide scroll button
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 100;
      
      // Show scroll button when not at bottom
      setShowScrollButton(!isAtBottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Monitor content height changes to show scroll button
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const currentHeight = scrollContainer.scrollHeight;
    const previousHeight = lastScrollHeightRef.current;
    
    // Content grew (new message or typing indicator)
    if (currentHeight > previousHeight && previousHeight > 0) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 100;
      
      // If user just sent a message (shouldAutoScroll is true), scroll to bottom
      if (shouldAutoScrollRef.current && isAtBottom) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end'
          });
          shouldAutoScrollRef.current = false;
        }, 50);
      } 
      // When AI response starts (typing indicator appears), scroll to show it
      else if (isTyping && typingRef.current) {
        setTimeout(() => {
          typingRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }, 100);
      }
      // When AI response arrives (typing stops, new message added), scroll to show start of message
      else if (!isTyping && lastMessageRef.current && messages.length > 0) {
        setTimeout(() => {
          lastMessageRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }, 100);
      }
      // If user was scrolled up, just show scroll button
      else if (!isAtBottom) {
        setShowScrollButton(true);
      }
    }
    
    lastScrollHeightRef.current = currentHeight;
  }, [messages.length, isTyping]);

  const scrollToBottom = (smooth = true, enableAutoScroll = false) => {
    if (!scrollRef.current) return;
    
    if (enableAutoScroll) {
      shouldAutoScrollRef.current = true;
    }
    
    if (smooth && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    } else {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    
    setShowScrollButton(false);
  };

  return {
    scrollRef,
    typingRef,
    lastMessageRef,
    messagesEndRef,
    scrollToBottom,
    showScrollButton
  };
}
