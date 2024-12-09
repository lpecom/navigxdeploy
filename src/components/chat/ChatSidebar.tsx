import { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Brain, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      loadMessages();
    }
  }, [isOpen, session?.user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      const { data: conversations } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('admin_user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (conversations?.[0]) {
        setConversationId(conversations[0].id);
        
        const { data: messagesData } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', conversations[0].id)
          .order('created_at', { ascending: true });

        if (messagesData) {
          const typedMessages: Message[] = messagesData.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            created_at: msg.created_at
          }));
          setMessages(typedMessages);
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

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userMessage,
          conversationId,
          userId: session.user.id,
          isAdmin: true
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
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl flex flex-col z-50"
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              AI Assistant
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white ml-4'
                      : 'bg-gray-100 text-gray-900 mr-4'
                  } shadow-sm`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything about your business..."
              disabled={isLoading}
              className="rounded-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="rounded-full px-4 hover:shadow-lg transition-shadow"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};