"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useChats() {
  const { data: session } = useSession();
  const [chats, setChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/chats');
          if (response.ok) {
            const data = await response.json();
            // Filter out duplicates by ID (in case API returns duplicates)
            const uniqueChats = data.chats.filter((chat, index, self) =>
              index === self.findIndex((c) => c.id === chat.id)
            );
            setChats(uniqueChats);
          }
        } catch (error) {
          console.error('Error loading chats:', error);
        } finally {
          setIsLoadingChats(false);
        }
      }
    };

    if (session?.user) {
      loadChats();
    }
  }, [session]);

  return { chats, setChats, isLoadingChats };
}
