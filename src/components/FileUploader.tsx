
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Folder, Info, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileUploaderProps {
  onFilesAdded: (files: File[], isFolder: boolean) => void;
}

export function FileUploader({ onFilesAdded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const validateJsonFiles = (files: File[]): File[] => {
    // Clear any previous errors
    setError(null);
    
    // Filter for JSON files
    const jsonFiles = files.filter(file => 
      file.name.endsWith('.json') || file.type === 'application/json'
    );
    
    if (files.length > 0 && jsonFiles.length === 0) {
      setError("Only JSON files are supported. Please upload files with .json extension.");
    }
    
    return jsonFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.items) {
      const items = Array.from(e.dataTransfer.items);
      const files: File[] = [];
      
      // Process all items
      const processItem = async (item: DataTransferItem) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      };
      
      // Process items
      Promise.all(items.map(processItem)).then(() => {
        const validFiles = validateJsonFiles(files);
        if (validFiles.length > 0) {
          onFilesAdded(validFiles, false);
        }
      });
    } else if (e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateJsonFiles(files);
      if (validFiles.length > 0) {
        onFilesAdded(validFiles, false);
      }
    }
  }, [onFilesAdded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = validateJsonFiles(files);
      if (validFiles.length > 0) {
        onFilesAdded(validFiles, false);
      }
      // Reset the input
      e.target.value = '';
    }
  }, [onFilesAdded]);

  const handleFolderSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = validateJsonFiles(files);
      if (validFiles.length > 0) {
        onFilesAdded(validFiles, true);
      }
      // Reset the input
      e.target.value = '';
    }
  }, [onFilesAdded]);

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Supports ChatGPT exports (.json files). Both the standard format and conversations with "mapping" structure are supported.
        </AlertDescription>
      </Alert>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">
            Drag & drop JSON files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Only .json files containing chat history will be processed
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div>
          <input
            type="file"
            id="file-upload"
            className="sr-only"
            onChange={handleFileSelect}
            multiple
            accept=".json,application/json"
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Select Files
            </label>
          </Button>
        </div>
        
        <div>
          <input
            type="file"
            id="folder-upload"
            className="sr-only"
            onChange={handleFolderSelect}
            multiple
            accept=".json,application/json"
            /* @ts-ignore */
            webkitdirectory="true"
            directory=""
          />
          <Button variant="outline" asChild>
            <label htmlFor="folder-upload" className="cursor-pointer">
              <Folder className="mr-2 h-4 w-4" />
              Select Folder
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
}
