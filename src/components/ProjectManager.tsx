
import React, { useState, useEffect } from "react";
import { Project, Message, STORAGE_KEYS } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, FolderPlus, Edit, ArchiveIcon, CirclePlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export function ProjectManager({ messages }: { messages: Message[] }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Load projects from local storage
  useEffect(() => {
    const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects).map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt)
        }));
        setProjects(parsedProjects);
      } catch (error) {
        console.error("Error parsing stored projects:", error);
        initializeDefaultProject();
      }
    } else {
      initializeDefaultProject();
    }
  }, []);

  // Update message counts for each project
  useEffect(() => {
    if (projects.length > 0 && messages.length > 0) {
      const updatedProjects = projects.map(project => {
        const projectMessages = messages.filter(
          msg => msg.metadata?.project === project.name
        );
        return {
          ...project,
          messageCount: projectMessages.length
        };
      });
      setProjects(updatedProjects);
    }
  }, [messages, projects]);

  // Save projects to local storage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
  }, [projects]);

  const initializeDefaultProject = () => {
    const defaultProject: Project = {
      id: crypto.randomUUID(),
      name: "AIDatagem General",
      description: "Default project for uncategorized messages",
      color: "#3b82f6", // blue-500
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0,
      status: "active"
    };
    setProjects([defaultProject]);
  };

  const handleEditProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject(project);
      setIsOpen(true);
    }
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      color: getRandomColor(),
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0,
      status: "active"
    };
    setCurrentProject(newProject);
    setIsOpen(true);
  };

  const handleSaveProject = () => {
    if (!currentProject) return;
    
    // Validate project name
    if (!currentProject.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for this project",
        variant: "destructive"
      });
      return;
    }
    
    // Check if it's a new project
    const isNewProject = !projects.some(p => p.id === currentProject.id);
    
    if (isNewProject) {
      setProjects([...projects, { ...currentProject, updatedAt: new Date() }]);
      toast({
        title: "Project created",
        description: `Project "${currentProject.name}" has been created`
      });
    } else {
      setProjects(projects.map(p => 
        p.id === currentProject.id ? { ...currentProject, updatedAt: new Date() } : p
      ));
      toast({
        title: "Project updated",
        description: `Project "${currentProject.name}" has been updated`
      });
    }
    
    setIsOpen(false);
  };

  const handleToggleArchive = (id: string) => {
    setProjects(projects.map(project => 
      project.id === id 
        ? { ...project, status: project.status === "active" ? "archived" : "active" }
        : project
    ));
  };

  // Helper function to generate random colors
  const getRandomColor = () => {
    const colors = [
      "#3b82f6", // blue-500
      "#10b981", // emerald-500
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
      "#f97316", // orange-500
      "#14b8a6", // teal-500
      "#6366f1", // indigo-500
      "#f43f5e", // rose-500
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Project Management</h2>
        <Button onClick={handleAddProject}>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>
            Categorize and organize your messages by project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {projects
                .filter(project => project.status === "active")
                .map(project => (
                  <ProjectItem 
                    key={project.id} 
                    project={project}
                    onEdit={() => handleEditProject(project.id)}
                    onArchive={() => handleToggleArchive(project.id)}
                  />
                ))
              }
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {projects.some(project => project.status === "archived") && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Archived Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {projects
                  .filter(project => project.status === "archived")
                  .map(project => (
                    <ProjectItem 
                      key={project.id} 
                      project={project}
                      onEdit={() => handleEditProject(project.id)}
                      onArchive={() => handleToggleArchive(project.id)}
                    />
                  ))
                }
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentProject?.id ? "Edit Project" : "Create New Project"}
            </DialogTitle>
            <DialogDescription>
              {currentProject?.id 
                ? "Update project details and settings" 
                : "Create a new project to categorize messages"}
            </DialogDescription>
          </DialogHeader>
          
          {currentProject && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input 
                  id="project-name" 
                  value={currentProject.name} 
                  onChange={(e) => setCurrentProject({...currentProject, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">Description (optional)</Label>
                <Input 
                  id="project-description" 
                  value={currentProject.description || ""} 
                  onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                  placeholder="Brief description of this project"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-color">Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="project-color" 
                    type="color"
                    value={currentProject.color} 
                    onChange={(e) => setCurrentProject({...currentProject, color: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                  <div 
                    className="border rounded-md flex-1 h-10 flex items-center px-3"
                    style={{ backgroundColor: currentProject.color + "20" }}
                  >
                    <span 
                      className="inline-block w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: currentProject.color }}
                    ></span>
                    {currentProject.name || "Project color preview"}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              {currentProject?.createdAt && projects.some(p => p.id === currentProject.id)
                ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ProjectItemProps {
  project: Project;
  onEdit: () => void;
  onArchive: () => void;
}

function ProjectItem({ project, onEdit, onArchive }: ProjectItemProps) {
  return (
    <div 
      className="border border-border/50 rounded-lg p-3 flex items-center justify-between hover:bg-accent/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-md flex items-center justify-center"
          style={{ backgroundColor: project.color }}
        >
          <Folder className="h-4 w-4 text-white" />
        </div>
        
        <div>
          <h3 className="font-medium">{project.name}</h3>
          {project.description && (
            <p className="text-xs text-muted-foreground">{project.description}</p>
          )}
        </div>
        
        <Badge variant="secondary" className="ml-2">
          {project.messageCount} messages
        </Badge>
      </div>
      
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit} title="Edit project">
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onArchive}
          title={project.status === "active" ? "Archive project" : "Restore project"}
        >
          <ArchiveIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
