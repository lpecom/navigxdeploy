interface StreetViewProps {
  address: string;
}

export const StreetView = ({ address }: StreetViewProps) => {
  const encodedAddress = encodeURIComponent(address);
  const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${encodedAddress}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

  return (
    <div className="mt-4 rounded-lg overflow-hidden">
      <img 
        src={imageUrl} 
        alt={`Street view of ${address}`}
        className="w-full h-[200px] object-cover"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
          e.currentTarget.className = 'w-full h-[200px] object-contain bg-muted';
        }}
      />
    </div>
  );
};