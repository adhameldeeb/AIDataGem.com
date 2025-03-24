
import { MessageStorageService } from './MessageStorageService';
import { FileStorageService } from './FileStorageService';
import { StatsStorageService } from './StatsStorageService';
import { VisualizationStorageService } from './VisualizationStorageService';
import { ModelsStorageService } from './ModelsStorageService';
import { ProjectStorageService } from './ProjectStorageService';
import { SecretStorageService } from './SecretStorageService';
import { ProcessStorageService } from './ProcessStorageService';
import { supabase } from '../supabase';

class SupabaseStorageService {
  private messageService = new MessageStorageService();
  private fileService = new FileStorageService();
  private statsService = new StatsStorageService();
  private visualizationService = new VisualizationStorageService();
  private modelsService = new ModelsStorageService();
  private projectService = new ProjectStorageService();
  private secretService = new SecretStorageService();
  private processService = new ProcessStorageService();

  // Messages
  saveMessages = this.messageService.saveMessages.bind(this.messageService);
  loadMessages = this.messageService.loadMessages.bind(this.messageService);

  // Files
  saveFiles = this.fileService.saveFiles.bind(this.fileService);
  loadFiles = this.fileService.loadFiles.bind(this.fileService);

  // Stats
  saveStats = this.statsService.saveStats.bind(this.statsService);
  loadStats = this.statsService.loadStats.bind(this.statsService);

  // Visualization
  saveVisualizationData = this.visualizationService.saveVisualizationData.bind(this.visualizationService);
  loadVisualizationData = this.visualizationService.loadVisualizationData.bind(this.visualizationService);

  // Models
  saveLLMModels = this.modelsService.saveLLMModels.bind(this.modelsService);
  loadLLMModels = this.modelsService.loadLLMModels.bind(this.modelsService);
  saveEmbeddingModels = this.modelsService.saveEmbeddingModels.bind(this.modelsService);
  loadEmbeddingModels = this.modelsService.loadEmbeddingModels.bind(this.modelsService);

  // Projects
  saveProjects = this.projectService.saveProjects.bind(this.projectService);
  loadProjects = this.projectService.loadProjects.bind(this.projectService);

  // Secrets
  saveSecret = this.secretService.saveSecret.bind(this.secretService);
  getSecret = this.secretService.getSecret.bind(this.secretService);
  deleteSecret = this.secretService.deleteSecret.bind(this.secretService);
  listSecrets = this.secretService.listSecrets.bind(this.secretService);

  // Processes
  saveProcess = this.processService.saveProcess.bind(this.processService);
  loadProcesses = this.processService.loadProcesses.bind(this.processService);

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      // Clear each table
      for (const table of Object.values(TABLES)) {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', 'dummy_to_match_nothing'); // Delete all rows
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error clearing all data from Supabase:', error);
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();
