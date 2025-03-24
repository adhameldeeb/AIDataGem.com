
import { MessageStorageService } from './MessageStorageService';
import { FileStorageService } from './FileStorageService';
import { StatsStorageService } from './StatsStorageService';
import { VisualizationStorageService } from './VisualizationStorageService';
import { ModelsStorageService } from './ModelsStorageService';
import { ProjectStorageService } from './ProjectStorageService';
import { SecretStorageService } from './SecretStorageService';
import { ProcessStorageService } from './ProcessStorageService';
import { supabase } from '../supabase';
import { TABLES } from '../supabase';

// Create instances of each service
const messageService = new MessageStorageService();
const fileService = new FileStorageService();
const statsService = new StatsStorageService();
const visualizationService = new VisualizationStorageService();
const modelsService = new ModelsStorageService();
const projectService = new ProjectStorageService();
const secretService = new SecretStorageService();
const processService = new ProcessStorageService();

// Combined service that exposes all functionality
export const supabaseStorageService = {
  // Message functions
  saveMessages: async (messages: any[]) => messageService.saveMessages(messages),
  loadMessages: async () => messageService.loadMessages(),
  
  // File functions
  saveFiles: async (files: any[]) => fileService.saveFiles(files),
  loadFiles: async () => fileService.loadFiles(),
  
  // Stats functions
  saveStats: async (stats: any) => statsService.saveStats(stats),
  loadStats: async () => statsService.loadStats(),
  
  // Visualization functions
  saveVisualizationData: async (data: any[]) => visualizationService.saveVisualizationData(data),
  loadVisualizationData: async () => visualizationService.loadVisualizationData(),
  
  // Models functions
  saveLLMModels: async (models: any[]) => modelsService.saveLLMModels(models),
  loadLLMModels: async () => modelsService.loadLLMModels(),
  saveEmbeddingModels: async (models: any[]) => modelsService.saveEmbeddingModels(models),
  loadEmbeddingModels: async () => modelsService.loadEmbeddingModels(),
  
  // Project functions
  saveProjects: async (projects: any[]) => projectService.saveProjects(projects),
  loadProjects: async () => projectService.loadProjects(),
  
  // Secret functions
  saveSecrets: async (secrets: any[]) => secretService.saveSecrets(secrets),
  loadSecrets: async () => secretService.loadSecrets(),
  
  // Individual secret functions (to match SecretsManager.tsx usage)
  saveSecret: async (key: string, value: string) => secretService.saveSecret(key, value),
  getSecret: async (key: string) => secretService.getSecret(key),
  deleteSecret: async (key: string) => secretService.deleteSecret(key),
  listSecrets: async () => secretService.listSecrets(),
  
  // Process functions
  saveProcesses: async (processes: any[]) => processService.saveProcesses(processes),
  loadProcesses: async () => processService.loadProcesses(),
  
  // Clear all data
  clearAll: async () => {
    try {
      // Clear each table
      for (const table of Object.values(TABLES)) {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', 'placeholder'); // Delete all rows
          
        if (error) {
          console.error(`Error clearing table ${table}:`, error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }
};
