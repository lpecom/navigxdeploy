import { Menu, Bell, User, Brain, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

const Header = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user previously enabled dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold dark:text-white">Dashboard</h1>
          </div>
            
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleDarkMode}
              className="text-gray-500 dark:text-gray-400"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsChatOpen(true)}
            >
              <Brain className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Header;