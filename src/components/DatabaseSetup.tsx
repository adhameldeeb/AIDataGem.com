
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase, ensureTablesExist, createDatabaseSchema } from "@/lib/supabase";
import { supabaseStorageService } from "@/lib/supabaseStorageService";
import { storageService } from "@/lib/storageService";
import { toast } from "sonner";
import { Database, Server, ArrowRight, CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react";

interface DatabaseSetupProps {
  onComplete?: () => void;
}

export function DatabaseSetup({ onComplete }: DatabaseSetupProps) {
  const [stage, setStage] = useState<"checking" | "creating" | "migrating" | "complete" | "error">("checking");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dbInfo, setDbInfo] = useState<{
    project?: string;
    url?: string;
    tables?: string[];
  }>({});

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    try {
      setStage("checking");
      setProgress(20);
      
      // Get database information
      const { data: projectRef } = await supabase.from('_metadata').select('name').single();
      
      setDbInfo(prev => ({
        ...prev,
        project: projectRef?.name || "Unknown"
      }));
      
      setProgress(40);
      
      // Check if tables exist
      const tablesExist = await ensureTablesExist();
      
      if (tablesExist) {
        setProgress(100);
        setStage("complete");
        onComplete?.();
      } else {
        setProgress(50);
        setStage("creating");
        await createTables();
      }
    } catch (error) {
      console.error("Error checking database:", error);
      setError(error instanceof Error ? error.message : "Unknown error checking database");
      setStage("error");
    }
  };

  const createTables = async () => {
    try {
      // Create the database schema
      await createDatabaseSchema();
      setProgress(70);
      
      // After tables are created, start migrating data
      setStage("migrating");
      await migrateData();
      
      setProgress(100);
      setStage("complete");
      onComplete?.();
      
      toast.success("Database setup complete and data migrated", {
        description: "Your Supabase database is ready to use"
      });
    } catch (error) {
      console.error("Error creating tables:", error);
      setError(error instanceof Error ? error.message : "Unknown error creating database tables");
      setStage("error");
    }
  };

  const migrateData = async () => {
    try {
      // Get data from localStorage
      const messages = storageService.loadMessages();
      const files = storageService.loadFiles();
      const projects = storageService.loadProjects();
      const models = storageService.loadLLMModels();
      const embeddingModels = storageService.loadEmbeddingModels();
      const visualizationData = storageService.loadVisualizationData();
      const stats = storageService.loadStats();
      
      // Save data to Supabase
      if (messages.length > 0) {
        await supabaseStorageService.saveMessages(messages);
      }
      
      if (files.length > 0) {
        await supabaseStorageService.saveFiles(files);
      }
      
      if (projects.length > 0) {
        await supabaseStorageService.saveProjects(projects);
      }
      
      if (models.length > 0) {
        await supabaseStorageService.saveLLMModels(models);
      }
      
      if (embeddingModels.length > 0) {
        await supabaseStorageService.saveEmbeddingModels(embeddingModels);
      }
      
      if (visualizationData.length > 0) {
        await supabaseStorageService.saveVisualizationData(visualizationData);
      }
      
      if (stats.totalFiles > 0 || stats.totalMessages > 0) {
        await supabaseStorageService.saveStats(stats);
      }
      
      return true;
    } catch (error) {
      console.error("Error migrating data:", error);
      throw error;
    }
  };

  const getStageMessage = () => {
    switch (stage) {
      case "checking":
        return "Checking database connection...";
      case "creating":
        return "Creating database tables...";
      case "migrating":
        return "Migrating data from local storage...";
      case "complete":
        return "Database setup complete!";
      case "error":
        return "Error setting up database";
      default:
        return "";
    }
  };

  return (
    <Card className="bg-slate-800/80 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-400" />
          Supabase Database Setup
        </CardTitle>
        <CardDescription>
          Configure your Supabase database for AIDatagem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-slate-700/30 p-4 rounded-md border border-slate-700 flex items-center gap-3">
            <Server className="h-10 w-10 text-blue-400" />
            <div>
              <p className="text-sm font-medium">Connected to Supabase Project</p>
              <p className="text-xs text-slate-400">{dbInfo.project || "Loading project info..."}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{getStageMessage()}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {stage === "error" && error && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-md p-3">
              <div className="flex gap-2 items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-300">
                  <p className="font-medium">Error during setup</p>
                  <p className="text-red-300/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {stage === "complete" && (
            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-md p-3">
              <div className="flex gap-2 items-start">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-300">
                  <p className="font-medium">Database Ready</p>
                  <p className="text-emerald-300/80 mt-1">
                    Your Supabase database has been set up and data has been migrated successfully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {stage === "error" && (
          <Button variant="outline" onClick={checkDatabase}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Setup
          </Button>
        )}
        
        {stage === "complete" && onComplete && (
          <Button onClick={onComplete} className="ml-auto">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
