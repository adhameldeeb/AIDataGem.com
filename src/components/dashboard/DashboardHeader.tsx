
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, Download, Trash2, Settings, BarChart2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#1a1d2a]/70 p-6 rounded-xl backdrop-blur-sm border border-slate-700/50 shadow-xl">
      <div className="flex items-center">
        <BarChart2 className="h-8 w-8 mr-3 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">AIDatagem</h1>
          <p className="text-slate-400">Transform your data into insights</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportData}
                disabled={!dbSetupComplete}
                className="bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Import
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import data from JSON file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                disabled={!dbSetupComplete}
                className="bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export all data to JSON file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={!dbSetupComplete}
              className="bg-red-900/30 hover:bg-red-800/50 text-red-300 border border-red-900/50"
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
              <Button variant="outline" onClick={() => document.querySelector('button[aria-label="Close"]')?.click()}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleClearAllData();
                  document.querySelector('button[aria-label="Close"]')?.click();
                }}
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
