import { Info } from "lucide-react";

export const AnnouncementBar = () => {
  return (
    <div className="bg-primary text-white py-2 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Info className="w-4 h-4" />
          <p>Aproveite nossas condições especiais para motoristas de aplicativo</p>
        </div>
      </div>
    </div>
  );
};