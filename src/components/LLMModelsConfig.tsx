
import React, { useState, useEffect } from "react";
import { LLMModel, EmbeddingModel, STORAGE_KEYS } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Default LLM models
const DEFAULT_LLM_MODELS: LLMModel[] = [
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "anthropic",
    priority: 100,
    status: "inactive",
    type: "llm",
    contextWindow: 200000,
    maxTokens: 4096
  },
  {
    id: "grok-3",
    name: "Grok-3",
    provider: "xai",
    priority: 90,
    status: "inactive",
    type: "llm",
    contextWindow: 128000,
    maxTokens: 4096
  },
  {
    id: "perplexity-online-research",
    name: "Perplexity Online Research",
    provider: "perplexity",
    priority: 80,
    status: "inactive",
    type: "llm",
    contextWindow: 12000,
    maxTokens: 2048
  },
  {
    id: "perplexity-base",
    name: "Perplexity Base",
    provider: "perplexity",
    priority: 70,
    status: "inactive",
    type: "llm",
    contextWindow: 8000,
    maxTokens: 2048
  }
];

// Default embedding models
const DEFAULT_EMBEDDING_MODELS: EmbeddingModel[] = [
  {
    id: "openai-text-embedding-3-small",
    name: "OpenAI Text Embedding 3 Small",
    provider: "openai",
    dimensions: 1536,
    status: "active",
    isDefault: true
  },
  {
    id: "cohere-embed-english-v3.0",
    name: "Cohere Embed English v3.0",
    provider: "cohere",
    dimensions: 1024,
    status: "inactive",
    isDefault: false
  },
  {
    id: "mixedbread-embed-xsmall",
    name: "Mixedbread Embed XSmall v1",
    provider: "mixedbread-ai",
    dimensions: 384,
    status: "inactive",
    isDefault: false
  }
];

export function LLMModelsConfig() {
  const [llmModels, setLLMModels] = useState<LLMModel[]>([]);
  const [embeddingModels, setEmbeddingModels] = useState<EmbeddingModel[]>([]);
  const [currentLLM, setCurrentLLM] = useState<LLMModel | null>(null);
  const [currentEmbedding, setCurrentEmbedding] = useState<EmbeddingModel | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("llm");
  const { toast } = useToast();

  // Load models from local storage
  useEffect(() => {
    const storedModels = localStorage.getItem(STORAGE_KEYS.MODELS);
    if (storedModels) {
      try {
        const parsed = JSON.parse(storedModels);
        if (parsed.llm && Array.isArray(parsed.llm)) {
          setLLMModels(parsed.llm);
        } else {
          setLLMModels(DEFAULT_LLM_MODELS);
        }
        if (parsed.embedding && Array.isArray(parsed.embedding)) {
          setEmbeddingModels(parsed.embedding);
        } else {
          setEmbeddingModels(DEFAULT_EMBEDDING_MODELS);
        }
      } catch (error) {
        console.error("Error parsing stored models:", error);
        setLLMModels(DEFAULT_LLM_MODELS);
        setEmbeddingModels(DEFAULT_EMBEDDING_MODELS);
      }
    } else {
      setLLMModels(DEFAULT_LLM_MODELS);
      setEmbeddingModels(DEFAULT_EMBEDDING_MODELS);
    }
  }, []);

  // Save models to local storage
  useEffect(() => {
    if (llmModels.length > 0 || embeddingModels.length > 0) {
      localStorage.setItem(
        STORAGE_KEYS.MODELS,
        JSON.stringify({ llm: llmModels, embedding: embeddingModels })
      );
    }
  }, [llmModels, embeddingModels]);

  // Save current embedding model to local storage
  useEffect(() => {
    const defaultModel = embeddingModels.find(model => model.isDefault);
    if (defaultModel) {
      localStorage.setItem(STORAGE_KEYS.EMBEDDING_MODEL, JSON.stringify(defaultModel));
    }
  }, [embeddingModels]);

  const handleToggleModelStatus = (type: "llm" | "embedding", id: string) => {
    if (type === "llm") {
      setLLMModels(prevModels =>
        prevModels.map(model =>
          model.id === id
            ? { ...model, status: model.status === "active" ? "inactive" : "active" }
            : model
        )
      );
    } else {
      setEmbeddingModels(prevModels =>
        prevModels.map(model =>
          model.id === id
            ? { ...model, status: model.status === "active" ? "inactive" : "active" }
            : model
        )
      );
    }
  };

  const handleConfigureModel = (type: "llm" | "embedding", id: string) => {
    if (type === "llm") {
      const model = llmModels.find(m => m.id === id);
      if (model) {
        setCurrentLLM(model);
        setActiveTab("llm");
        setIsOpen(true);
      }
    } else {
      const model = embeddingModels.find(m => m.id === id);
      if (model) {
        setCurrentEmbedding(model);
        setActiveTab("embedding");
        setIsOpen(true);
      }
    }
  };

  const handleSaveConfig = () => {
    if (activeTab === "llm" && currentLLM) {
      setLLMModels(prevModels =>
        prevModels.map(model =>
          model.id === currentLLM.id ? currentLLM : model
        )
      );
      toast({
        title: "LLM Model Updated",
        description: `${currentLLM.name} configuration has been updated.`,
      });
    } else if (activeTab === "embedding" && currentEmbedding) {
      // If setting as default, update all other models to not be default
      let updatedModels = embeddingModels;
      if (currentEmbedding.isDefault) {
        updatedModels = embeddingModels.map(model => ({
          ...model,
          isDefault: model.id === currentEmbedding.id
        }));
      }
      
      setEmbeddingModels(
        updatedModels.map(model =>
          model.id === currentEmbedding.id ? currentEmbedding : model
        )
      );
      
      toast({
        title: "Embedding Model Updated",
        description: `${currentEmbedding.name} configuration has been updated.`,
      });
    }
    
    setIsOpen(false);
  };

  const handleAddNew = (type: "llm" | "embedding") => {
    if (type === "llm") {
      const newModel: LLMModel = {
        id: `model-${Date.now()}`,
        name: "New Custom Model",
        provider: "custom",
        priority: 50,
        status: "inactive",
        type: "llm"
      };
      setCurrentLLM(newModel);
      setActiveTab("llm");
      setIsOpen(true);
    } else {
      const newModel: EmbeddingModel = {
        id: `embedding-${Date.now()}`,
        name: "New Embedding Model",
        provider: "custom",
        dimensions: 768,
        status: "inactive",
        isDefault: false
      };
      setCurrentEmbedding(newModel);
      setActiveTab("embedding");
      setIsOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">LLM Models Configuration</h2>
        <div className="flex gap-2">
          <Button onClick={() => handleAddNew("llm")} variant="outline">
            Add LLM Model
          </Button>
          <Button onClick={() => handleAddNew("embedding")} variant="outline">
            Add Embedding Model
          </Button>
        </div>
      </div>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>LLM Models</CardTitle>
          <CardDescription>
            Configure large language models for text generation and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 font-medium text-muted-foreground">
              <div>Model</div>
              <div>Provider</div>
              <div>Priority</div>
              <div className="flex justify-between">Status</div>
            </div>
            <ScrollArea className="h-[200px]">
              {llmModels.map(model => (
                <div 
                  key={model.id}
                  className="grid grid-cols-4 py-3 border-b border-border/40 items-center"
                >
                  <div className="font-medium">{model.name}</div>
                  <div>{model.provider}</div>
                  <div>
                    <Input 
                      className="w-20 bg-background/60" 
                      value={model.priority}
                      onChange={(e) => {
                        const priority = parseInt(e.target.value, 10);
                        if (!isNaN(priority)) {
                          setLLMModels(prevModels =>
                            prevModels.map(m =>
                              m.id === model.id ? { ...m, priority } : m
                            )
                          );
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={model.status === "active"}
                        onCheckedChange={() => handleToggleModelStatus("llm", model.id)}
                      />
                      <span className={model.status === "active" ? "text-primary" : "text-muted-foreground"}>
                        {model.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleConfigureModel("llm", model.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>Embedding Models</CardTitle>
          <CardDescription>
            Configure vector embedding models for semantic search and similarity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 font-medium text-muted-foreground">
              <div>Model</div>
              <div>Provider</div>
              <div>Dimensions</div>
              <div className="flex justify-between">Status</div>
            </div>
            <ScrollArea className="h-[200px]">
              {embeddingModels.map(model => (
                <div 
                  key={model.id}
                  className="grid grid-cols-4 py-3 border-b border-border/40 items-center"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    {model.isDefault && (
                      <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div>{model.provider}</div>
                  <div>{model.dimensions}</div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={model.status === "active"}
                        onCheckedChange={() => handleToggleModelStatus("embedding", model.id)}
                      />
                      <span className={model.status === "active" ? "text-primary" : "text-muted-foreground"}>
                        {model.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleConfigureModel("embedding", model.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "llm" 
                ? (currentLLM?.id.startsWith('model-') ? "Add New LLM Model" : "Configure LLM Model")
                : (currentEmbedding?.id.startsWith('embedding-') ? "Add New Embedding Model" : "Configure Embedding Model")
              }
            </DialogTitle>
            <DialogDescription>
              {activeTab === "llm" 
                ? "Configure connection and API settings for this LLM model"
                : "Configure connection and API settings for this embedding model"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="llm" disabled={!currentLLM}>LLM Model</TabsTrigger>
              <TabsTrigger value="embedding" disabled={!currentEmbedding}>Embedding Model</TabsTrigger>
            </TabsList>
            
            <TabsContent value="llm" className="space-y-4 mt-4">
              {currentLLM && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="llm-name">Model Name</Label>
                    <Input 
                      id="llm-name" 
                      value={currentLLM.name} 
                      onChange={(e) => setCurrentLLM({...currentLLM, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="llm-provider">Provider</Label>
                    <Input 
                      id="llm-provider" 
                      value={currentLLM.provider} 
                      onChange={(e) => setCurrentLLM({...currentLLM, provider: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="llm-priority">Priority</Label>
                    <Input 
                      id="llm-priority" 
                      type="number"
                      value={currentLLM.priority} 
                      onChange={(e) => {
                        const priority = parseInt(e.target.value, 10);
                        if (!isNaN(priority)) {
                          setCurrentLLM({...currentLLM, priority});
                        }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="llm-api-key">API Key</Label>
                    <Input 
                      id="llm-api-key" 
                      type="password"
                      value={currentLLM.apiKey || ""} 
                      onChange={(e) => setCurrentLLM({...currentLLM, apiKey: e.target.value})}
                      placeholder="Enter API key"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="llm-api-endpoint">API Endpoint (optional)</Label>
                    <Input 
                      id="llm-api-endpoint" 
                      value={currentLLM.apiEndpoint || ""} 
                      onChange={(e) => setCurrentLLM({...currentLLM, apiEndpoint: e.target.value})}
                      placeholder="https://api.example.com/v1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="llm-status"
                      checked={currentLLM.status === "active"}
                      onCheckedChange={(checked) => 
                        setCurrentLLM({...currentLLM, status: checked ? "active" : "inactive"})
                      }
                    />
                    <Label htmlFor="llm-status">Active</Label>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="embedding" className="space-y-4 mt-4">
              {currentEmbedding && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="embedding-name">Model Name</Label>
                    <Input 
                      id="embedding-name" 
                      value={currentEmbedding.name} 
                      onChange={(e) => setCurrentEmbedding({...currentEmbedding, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="embedding-provider">Provider</Label>
                    <Input 
                      id="embedding-provider" 
                      value={currentEmbedding.provider} 
                      onChange={(e) => setCurrentEmbedding({...currentEmbedding, provider: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="embedding-dimensions">Dimensions</Label>
                    <Input 
                      id="embedding-dimensions" 
                      type="number"
                      value={currentEmbedding.dimensions} 
                      onChange={(e) => {
                        const dimensions = parseInt(e.target.value, 10);
                        if (!isNaN(dimensions)) {
                          setCurrentEmbedding({...currentEmbedding, dimensions});
                        }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="embedding-api-key">API Key</Label>
                    <Input 
                      id="embedding-api-key" 
                      type="password"
                      value={currentEmbedding.apiKey || ""} 
                      onChange={(e) => setCurrentEmbedding({...currentEmbedding, apiKey: e.target.value})}
                      placeholder="Enter API key"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="embedding-api-endpoint">API Endpoint (optional)</Label>
                    <Input 
                      id="embedding-api-endpoint" 
                      value={currentEmbedding.apiEndpoint || ""} 
                      onChange={(e) => setCurrentEmbedding({...currentEmbedding, apiEndpoint: e.target.value})}
                      placeholder="https://api.example.com/v1/embeddings"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="embedding-status"
                      checked={currentEmbedding.status === "active"}
                      onCheckedChange={(checked) => 
                        setCurrentEmbedding({...currentEmbedding, status: checked ? "active" : "inactive"})
                      }
                    />
                    <Label htmlFor="embedding-status">Active</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="embedding-default"
                      checked={currentEmbedding.isDefault}
                      onCheckedChange={(checked) => 
                        setCurrentEmbedding({...currentEmbedding, isDefault: checked})
                      }
                    />
                    <Label htmlFor="embedding-default">Set as Default Embedding Model</Label>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>
              {(activeTab === "llm" && currentLLM?.id.startsWith('model-')) || 
               (activeTab === "embedding" && currentEmbedding?.id.startsWith('embedding-'))
                ? "Add Model" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
