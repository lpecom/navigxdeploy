import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload } from "lucide-react";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

export const FleetImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const headers = [
      "fleet_number",
      "plate",
      "model",
      "group",
      "color",
      "state",
      "chassis_number",
      "renavam_number",
      "manufacture_year",
      "model_year",
      "manufacturer",
      "contract_number",
      "customer_name",
      "customer_document",
      "status",
      "branch"
    ];
    
    const csvContent = Papa.unparse([headers]);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fleet_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const { data, errors } = results;
          
          if (errors.length > 0) {
            throw new Error("Error parsing CSV file");
          }

          const { data: uploadData, error: uploadError } = await supabase.functions.invoke(
            "process-fleet-csv",
            {
              body: { csvData: data },
            }
          );

          if (uploadError) throw uploadError;

          toast({
            title: "Success!",
            description: "Fleet data has been updated successfully.",
          });
        },
        error: (error) => {
          throw error;
        },
      });
    } catch (error) {
      console.error("Error uploading fleet data:", error);
      toast({
        title: "Error",
        description: "Failed to process the CSV file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
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
            Download Template
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button disabled={isUploading}>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Processing..." : "Import CSV"}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Download the template and fill it with your fleet data.
          The file should contain information such as: Fleet Number, Plate,
          Model, Group, Color, State, Chassis Number, etc.
        </p>
      </CardContent>
    </Card>
  );
};