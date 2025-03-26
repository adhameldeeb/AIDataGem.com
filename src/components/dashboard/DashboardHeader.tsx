
import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DatabaseZap, Upload, Download, Trash2, FileUp, Menu, MoreVertical } from "lucide-react";

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
  const handleImportClick = () => {
    handleImportData();
  };

  const handleExportClick = () => {
    handleExportData();
  };

  const handleClearClick = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      handleClearAllData();
    }
  };

  const handleFolderUpload = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true; // Non-standard attribute for directory selection
    
    // Listen for file selection
    input.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        // Convert FileList to array and pass to handler
        const filesArray = Array.from(input.files);
        // This would be handled by a parent component
        // handleFolderSelected(filesArray);
      }
    });
    
    // Programmatically click the hidden input
    // Using a safer way to trigger click
    input.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  };

  const handleFileUpload = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.json,.csv,.txt';
    
    // Listen for file selection
    input.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        // Convert FileList to array and pass to handler
        const filesArray = Array.from(input.files);
        // This would be handled by a parent component
        // handleFilesSelected(filesArray);
      }
    });
    
    // Programmatically click the hidden input
    // Using a safer way to trigger click
    input.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1a1d2a]/80 p-6 rounded-xl backdrop-blur-sm border border-slate-700/50 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600 text-white">
          <DatabaseZap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AIDatagem</h1>
          <p className="text-sm text-slate-400">
            {dbSetupComplete 
              ? "Connected to Supabase Database" 
              : "Local Storage Mode - Connect to Supabase for Persistence"}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center md:justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleFileUpload}
        >
          <FileUp className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Files</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleFolderUpload}
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Folder</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="hidden sm:inline">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleImportClick}>
              <Download className="h-4 w-4 mr-2" />
              Import Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportClick}>
              <Upload className="h-4 w-4 mr-2" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleClearClick}
              className="text-red-500 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
