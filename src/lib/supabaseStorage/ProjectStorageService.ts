
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { Project } from '../types';

export class ProjectStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.PROJECTS);
  }

  async saveProjects(projects: Project[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedProjects = projects.map(project => ({
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString()
      }));
      
      await this.upsertData(formattedProjects);
    } catch (error) {
      console.error('Error saving projects to Supabase:', error);
    }
  }

  async loadProjects(): Promise<Project[]> {
    try {
      const data = await this.loadData<any>();
      
      // Transform date strings back to Date objects
      return data.map(project => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading projects from Supabase:', error);
      return [];
    }
  }
}
