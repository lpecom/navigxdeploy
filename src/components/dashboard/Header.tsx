import { Search, LogOut, Bell, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-14 bg-white border-b border-gray-200 z-40">
      <div className="h-full px-4 flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8 flex-1">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-gray-50/80 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-500 transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Driver Portal
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="absolute top-1 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4 text-gray-500" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 ml-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm font-medium">JD</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700">John Doe</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;