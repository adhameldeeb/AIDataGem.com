
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase, ensureTablesExist, createDatabaseSchema, isSupabaseAvailable } from "@/lib/supabase";
import { supabaseStorageService } from "@/lib/supabaseStorage";
import { storageService } from "@/lib/storageService";
import { toast } from "sonner";
import { Database, Server, ArrowRight, CheckCircle2, RefreshCw, AlertTriangle, Info } from "lucide-react";

interface DatabaseSetupProps {
  onComplete?: () => void;
}

export function DatabaseSetup({ onComplete }: DatabaseSetupProps) {
  const [stage, setStage] = useState<"checking" | "creating" | "migrating" | "complete" | "error" | "not-configured">("checking");
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
      
      const available = await isSupabaseAvailable();
      
      if (!available) {
        setStage("not-configured");
        setError("Supabase environment variables are missing or connection failed");
        return;
      }
      
      try {
        // Try to get project information (may fail silently)
        const { data: appInfo } = await supabase.rpc('get_app_info');
        
        if (appInfo && typeof appInfo === 'object') {
          setDbInfo(prev => ({
            ...prev,
            project: appInfo.name || "AIDatagem"
          }));
        } else {
          setDbInfo(prev => ({
            ...prev,
            project: "AIDatagem"
          }));
        }
      } catch (e) {
        // If we can't get the app info, just use a default name
        setDbInfo(prev => ({
          ...prev,
          project: "AIDatagem"
        }));
      }
      
      setProgress(40);
      
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
      await createDatabaseSchema();
      setProgress(70);
      
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
      const messages = storageService.loadMessages();
      const files = storageService.loadFiles();
      
      let projects: any[] = [];
      let models: any[] = [];
      let embeddingModels: any[] = [];
      let visualizationData: any[] = [];
      let stats = storageService.loadStats();
      
      if ('loadProjects' in storageService && typeof storageService.loadProjects === 'function') {
        projects = storageService.loadProjects();
      }
      
      if ('loadLLMModels' in storageService && typeof storageService.loadLLMModels === 'function') {
        models = storageService.loadLLMModels();
      }
      
      if ('loadEmbeddingModels' in storageService && typeof storageService.loadEmbeddingModels === 'function') {
        embeddingModels = storageService.loadEmbeddingModels();
      }
      
      if ('loadVisualizationData' in storageService && typeof storageService.loadVisualizationData === 'function') {
        visualizationData = storageService.loadVisualizationData();
      }
      
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
      case "not-configured":
        return "Supabase not configured";
      default:
        return "";
    }
  };

  if (stage === "not-configured") {
    return (
      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-amber-400" />
            Supabase Configuration Required
          </CardTitle>
          <CardDescription>
            Configure your Supabase project for AIDatagem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-md p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-sm">
                Supabase environment variables are missing. To use database features, you need to:
              </p>
              <ol className="text-sm space-y-1 list-decimal pl-4">
                <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">supabase.com</a></li>
                <li>Set the following environment variables in your project:
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li><code className="bg-slate-900 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> - Your Supabase project URL</li>
                    <li><code className="bg-slate-900 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> - Your Supabase anon/public key</li>
                  </ul>
                </li>
                <li>Restart your application after setting the environment variables</li>
              </ol>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={checkDatabase}
            className="mr-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Connection Again
          </Button>
          {onComplete && (
            <Button onClick={onComplete} variant="secondary">
              Continue Without Database
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

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
