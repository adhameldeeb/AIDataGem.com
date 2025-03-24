
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, Download, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DashboardHeaderProps {
  dbSetupComplete: boolean;
  handleImportData: () => void;
  handleExportData: () => void;
  handleClearAllData: () => void;
}

export function DashboardHeader({
  dbSetupComplete,
  handleImportData,
  handleExportData,
  handleClearAllData
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">AIDatagem Dashboard</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportData}
          title="Import data"
          disabled={!dbSetupComplete}
        >
          <Save className="h-4 w-4 mr-2" />
          Import
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportData}
          title="Export all data"
          disabled={!dbSetupComplete}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              title="Clear all data"
              disabled={!dbSetupComplete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Data
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle>Clear All Data</DialogTitle>
              <DialogDescription>
                This will permanently delete all files, messages, and visualization data.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={handleClearAllData}
              >
                Yes, Clear All Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
