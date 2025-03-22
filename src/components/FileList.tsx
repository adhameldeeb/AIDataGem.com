
import React from "react";
import { UploadedFile } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw, Calendar } from "lucide-react";
import { format } from "date-fns";

interface FileListProps {
  files: UploadedFile[];
  onClearCompleted: () => void;
  onRetry: (fileId: string) => void;
}

export function FileList({ files, onClearCompleted, onRetry }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No files uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {files.map((file) => (
          <div 
            key={file.id}
            className="border rounded-lg p-3 flex items-center gap-2"
          >
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <FileStatusIndicator file={file} onRetry={() => onRetry(file.id)} />
              </div>
              <div className="mt-1">
                <Progress value={file.progress} className="h-2" />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <div className="flex items-center gap-1">
                  {file.messagesCount !== undefined && (
                    <p className="text-xs text-muted-foreground mr-2">
                      {file.messagesCount} messages
                    </p>
                  )}
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {format(file.timestamp, "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.some(f => f.status === 'completed') && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearCompleted}
          >
            Clear Completed
          </Button>
        </div>
      )}
    </div>
  );
}

function FileStatusIndicator({ file, onRetry }: { file: UploadedFile, onRetry: () => void }) {
  if (file.status === 'pending') {
    return <span className="text-xs text-muted-foreground">Pending</span>;
  }

  if (file.status === 'processing') {
    return <span className="text-xs text-blue-500">{file.progress.toFixed(0)}%</span>;
  }

  if (file.status === 'completed') {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  }

  if (file.status === 'error') {
    return (
      <div className="flex items-center gap-1">
        <XCircle className="h-4 w-4 text-red-500" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onRetry}
          title={file.error || "Retry"}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return null;
}
