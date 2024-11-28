import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Settings, Brain, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

interface DriverHeaderProps {
  onMenuClick: () => void;
}

const DriverHeader = ({ onMenuClick }: DriverHeaderProps) => {
  const [driverName, setDriverName] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const getDriverDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: drivers } = await supabase
        .from('driver_details')
        .select('full_name')
        .eq('email', session.user.email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (drivers && drivers.length > 0) {
        setDriverName(drivers[0].full_name);
      }
    };

    getDriverDetails();

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

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5 dark:text-gray-400" />
              </Button>
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
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium text-sm dark:text-primary-200">
                    {driverName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{driverName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Motorista</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default DriverHeader;