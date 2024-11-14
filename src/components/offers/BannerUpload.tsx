import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BannerUploadProps {
  currentBanner?: string;
  onBannerChange: (bannerUrl: string) => void;
}

export const BannerUpload = ({
  currentBanner,
  onBannerChange,
}: BannerUploadProps) => {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState(currentBanner);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll just use a URL.createObjectURL for preview
    // In a real app, you'd upload this to Supabase storage
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onBannerChange(url);

    toast({
      title: "Banner updated",
      description: "Your banner image has been updated successfully.",
    });
  };

  const removeBanner = () => {
    setPreviewUrl(undefined);
    onBannerChange("");
  };

  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Banner preview"
            className="w-full aspect-[21/9] rounded-lg object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeBanner}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="banner-upload"
          />
          <label
            htmlFor="banner-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <span className="text-sm text-gray-600">
              Click to upload banner image
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Recommended size: 1920x820px
            </span>
          </label>
        </div>
      )}
    </div>
  );
};