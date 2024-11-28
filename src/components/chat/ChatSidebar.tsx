import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSidebar = ({ isOpen, onClose }: ChatSidebarProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      loadMessages();
    }
  }, [isOpen, session?.user?.id]);

  const loadMessages = async () => {
    try {
      // Get the most recent conversation
      const { data: conversations } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('driver_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (conversations?.[0]) {
        setConversationId(conversations[0].id);
        
        const { data: messages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', conversations[0].id)
          .order('created_at', { ascending: true });

        if (messages) {
          setMessages(messages);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !session?.user?.id) return;

    setIsLoading(true);
    const userMessage = message;
    setMessage("");

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userMessage,
          conversationId,
          driverId: session.user.id
        },
      });

      if (response.error) throw response.error;

      const { message: aiMessage, conversationId: newConversationId } = response.data;
      
      if (!conversationId && newConversationId) {
        setConversationId(newConversationId);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};