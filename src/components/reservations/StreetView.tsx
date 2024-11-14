import { ExternalLink } from "lucide-react";

interface StreetViewProps {
  address: string;
}

export const StreetView = ({ address }: StreetViewProps) => {
  const API_KEY = "AIzaSyDjnhLdrsCZlcSjJemKCmjYqfqk11_nwM8";
  const encodedAddress = encodeURIComponent(address);
  const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${encodedAddress}&key=${API_KEY}`;
  const mapsUrl = `https://www.google.com/maps?q=${encodedAddress}`;

  return (
    <div className="mt-6 mb-6 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Visualização do Local</h3>
        <a 
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Abrir no Maps
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <a 
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        <img 
          src={imageUrl} 
          alt={`Visualização da rua ${address}`}
          className="w-full h-[200px] object-cover hover:opacity-90 transition-opacity"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
            e.currentTarget.className = 'w-full h-[200px] object-contain bg-muted';
          }}
        />
      </a>
    </div>
  );
};