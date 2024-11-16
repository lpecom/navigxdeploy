import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DriverHeader = () => {
  const navigate = useNavigate();
  const [driverName, setDriverName] = useState("");

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
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-4">
          <img 
            src="https://i.imghippo.com/files/uafE3798xA.png" 
            alt="Navig Logo" 
            className="h-8 w-auto"
          />
          <div className="h-6 w-px bg-gray-200" />
          <span className="text-sm font-medium text-gray-900">Portal do Motorista</span>
        </div>

        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{driverName}</span>
              <button 
                onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-primary transition-colors"
              >
                Sair
              </button>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium text-sm">
                {driverName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DriverHeader;