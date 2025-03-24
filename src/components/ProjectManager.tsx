
import React, { useState, useEffect } from "react";
import { Project, Message, STORAGE_KEYS } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, FolderPlus, Edit, ArchiveIcon, CirclePlusIcon, Hash, Tag, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

export function ProjectManager({ messages }: { messages: Message[] }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newTag, setNewTag] = useState("");
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

  // Extract all unique subjects from messages
  useEffect(() => {
    if (messages.length > 0) {
      const allSubjects = messages
        .filter(msg => msg.metadata?.subject)
        .map(msg => msg.metadata?.subject as string);
      
      const uniqueSubjects = Array.from(new Set(allSubjects));
      setSubjects(uniqueSubjects);
    }
  }, [messages]);

  // Update message counts for each project
  useEffect(() => {
    if (projects.length > 0 && messages.length > 0) {
      const updatedProjects = projects.map(project => {
        const projectMessages = messages.filter(
          msg => msg.metadata?.project === project.name
        );
        
        // Extract subjects used in this project's messages
        const projectSubjects = Array.from(new Set(
          projectMessages
            .filter(msg => msg.metadata?.subject)
            .map(msg => msg.metadata?.subject as string)
        ));
        
        return {
          ...project,
          messageCount: projectMessages.length,
          subjects: projectSubjects
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
      status: "active",
      subjects: [],
      tags: ["general", "uncategorized"],
      priority: "medium"
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
      status: "active",
      subjects: [],
      tags: [],
      priority: "medium"
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

  const handleAddSubject = () => {
    if (!currentProject || !newSubject.trim()) return;
    
    const updatedSubjects = [...(currentProject.subjects || [])];
    if (!updatedSubjects.includes(newSubject)) {
      updatedSubjects.push(newSubject);
      setCurrentProject({...currentProject, subjects: updatedSubjects});
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    if (!currentProject) return;
    
    const updatedSubjects = (currentProject.subjects || []).filter(s => s !== subject);
    setCurrentProject({...currentProject, subjects: updatedSubjects});
  };

  const handleAddTag = () => {
    if (!currentProject || !newTag.trim()) return;
    
    const updatedTags = [...(currentProject.tags || [])];
    if (!updatedTags.includes(newTag)) {
      updatedTags.push(newTag);
      setCurrentProject({...currentProject, tags: updatedTags});
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (!currentProject) return;
    
    const updatedTags = (currentProject.tags || []).filter(t => t !== tag);
    setCurrentProject({...currentProject, tags: updatedTags});
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
        <Button onClick={handleAddProject} className="bg-indigo-700 hover:bg-indigo-800">
          <FolderPlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Card className="bg-slate-800/80 border-slate-700">
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
        <Card className="bg-slate-800/80 border-slate-700">
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
        <DialogContent className="max-w-md bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {currentProject?.id ? "Edit Project" : "Create New Project"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
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
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">Description (optional)</Label>
                <Textarea 
                  id="project-description" 
                  value={currentProject.description || ""} 
                  onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                  placeholder="Brief description of this project"
                  className="bg-slate-900 border-slate-700"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-priority">Priority</Label>
                <div className="flex gap-2">
                  {["low", "medium", "high", "urgent"].map(priority => (
                    <Button
                      key={priority}
                      type="button"
                      variant={currentProject.priority === priority ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentProject({...currentProject, priority})}
                      className={
                        currentProject.priority === priority 
                          ? (priority === "urgent" ? "bg-red-700" : 
                             priority === "high" ? "bg-amber-700" : 
                             priority === "medium" ? "bg-blue-700" : "bg-green-700")
                          : "bg-slate-900"
                      }
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      {priority === "urgent" && <AlertCircle className="ml-1 h-3 w-3" />}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-color">Project Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="project-color" 
                    type="color"
                    value={currentProject.color} 
                    onChange={(e) => setCurrentProject({...currentProject, color: e.target.value})}
                    className="w-12 h-10 p-1 bg-transparent"
                  />
                  <div 
                    className="border rounded-md flex-1 h-10 flex items-center px-3 border-slate-700"
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
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Subjects
                </Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md border-slate-700 bg-slate-900 min-h-[60px]">
                  {currentProject.subjects && currentProject.subjects.length > 0 ? (
                    currentProject.subjects.map(subject => (
                      <Badge 
                        key={subject} 
                        variant="secondary"
                        className="flex items-center gap-1 bg-emerald-900/50 hover:bg-emerald-900"
                      >
                        {subject}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSubject(subject)}
                          className="h-4 w-4 p-0 ml-1 hover:bg-red-700 rounded-full"
                        >
                          ×
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">No subjects added yet</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new subject"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="bg-slate-900 border-slate-700"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddSubject}
                    disabled={!newSubject.trim()}
                    className="bg-emerald-700 hover:bg-emerald-800"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md border-slate-700 bg-slate-900 min-h-[60px]">
                  {currentProject.tags && currentProject.tags.length > 0 ? (
                    currentProject.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline"
                        className="flex items-center gap-1 bg-blue-900/50 hover:bg-blue-900"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTag(tag)}
                          className="h-4 w-4 p-0 ml-1 hover:bg-red-700 rounded-full"
                        >
                          ×
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">No tags added yet</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="bg-slate-900 border-slate-700"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="bg-blue-700 hover:bg-blue-800"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="h-4 w-4 text-slate-500" />
                {currentProject.id ? (
                  <span>Last updated: {currentProject.updatedAt.toLocaleString()}</span>
                ) : (
                  <span>This project will be created now</span>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-slate-900 border-slate-700">
              Cancel
            </Button>
            <Button onClick={handleSaveProject} className="bg-indigo-700 hover:bg-indigo-800">
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
      className="border border-slate-700 rounded-lg p-3 flex items-center justify-between hover:bg-slate-700/20 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-md flex items-center justify-center"
          style={{ backgroundColor: project.color }}
        >
          <Folder className="h-4 w-4 text-white" />
        </div>
        
        <div>
          <h3 className="font-medium flex items-center gap-2">
            {project.name}
            {project.priority && (
              <Badge 
                variant="outline" 
                className={
                  project.priority === "urgent" ? "bg-red-900/30 text-red-300 border-red-800" : 
                  project.priority === "high" ? "bg-amber-900/30 text-amber-300 border-amber-800" :
                  project.priority === "medium" ? "bg-blue-900/30 text-blue-300 border-blue-800" :
                  "bg-green-900/30 text-green-300 border-green-800"
                }
              >
                {project.priority}
              </Badge>
            )}
          </h3>
          {project.description && (
            <p className="text-xs text-slate-400">{project.description}</p>
          )}
          {project.subjects && project.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {project.subjects.map(subject => (
                <Badge 
                  key={subject} 
                  variant="outline"
                  className="text-[10px] py-0 px-1 h-4 bg-emerald-900/30 text-emerald-300 border-emerald-800"
                >
                  {subject}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-300">
          {project.messageCount} messages
        </Badge>
      </div>
      
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit} title="Edit project" className="text-slate-400 hover:text-white">
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onArchive}
          title={project.status === "active" ? "Archive project" : "Restore project"}
          className="text-slate-400 hover:text-white"
        >
          <ArchiveIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
