
import React from "react";
import { UploadStats } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadProgressProps {
  stats: UploadStats;
}

export function UploadProgress({ stats }: UploadProgressProps) {
  const filePercentage = stats.totalFiles > 0 
    ? Math.round((stats.processedFiles / stats.totalFiles) * 100) 
    : 0;
  
  const messagePercentage = stats.totalMessages > 0 
    ? Math.round((stats.processedMessages / stats.totalMessages) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Upload Progress</CardTitle>
        <CardDescription>Track the progress of your file processing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Files</span>
              <span>{stats.processedFiles} / {stats.totalFiles}</span>
            </div>
            <Progress value={filePercentage} />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Messages</span>
              <span>{stats.processedMessages} / {stats.totalMessages}</span>
            </div>
            <Progress value={messagePercentage} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
