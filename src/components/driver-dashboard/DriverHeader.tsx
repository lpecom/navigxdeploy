import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const DriverHeader = () => {
  const navigate = useNavigate();
  const [driverName, setDriverName] = useState("");

  useEffect(() => {
    const getDriverDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('driver_details')
        .select('full_name')
        .eq('email', session.user.email)
        .single();

      if (data) {
        setDriverName(data.full_name);
      }
    };

    getDriverDetails();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src="https://i.imghippo.com/files/uafE3798xA.png" 
            alt="Navig Logo" 
            className="h-8 w-auto"
          />
          <span className="text-lg font-medium">Portal do Motorista</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Olá, {driverName}</span>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DriverHeader;