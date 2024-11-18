import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const FleetImport = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = () => {
    window.open('https://brown-georgeanne-53.tiiny.site/', '_blank');
  };

  const processHtmlFile = async () => {
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "process-fleet-csv",
        {
          body: { htmlUrl: 'https://brown-georgeanne-53.tiiny.site/' },
        }
      );

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Fleet data has been updated successfully. Processed ${data.processed} vehicles.`,
      });
    } catch (error) {
      console.error("Error processing HTML file:", error);
      toast({
        title: "Error",
        description: "Failed to process the fleet data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Fleet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={downloadTemplate} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            View Template
          </Button>
          <Button 
            onClick={processHtmlFile} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Import Fleet Data"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          View the template to check the format of the fleet data.
          Click "Import Fleet Data" to process and import the data from the HTML file.
        </p>
      </CardContent>
    </Card>
  );
};