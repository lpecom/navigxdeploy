import { Link as LinkIcon } from "lucide-react";
import { UberStats } from "./UberStats";

interface UberConnectedProps {
  stats: {
    earnings: number;
    trips: number;
    lastTripDate: string | null;
  } | null;
  isLoadingStats: boolean;
}

export const UberConnected = ({ stats, isLoadingStats }: UberConnectedProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        <p className="flex items-center gap-2 text-green-600 mb-4">
          <LinkIcon className="w-4 h-4" />
          Conta Uber conectada
        </p>
      </div>
      <UberStats stats={stats} isLoadingStats={isLoadingStats} />
    </div>
  );
};