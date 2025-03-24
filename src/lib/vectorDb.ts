
import { VectorEntry, SearchResult, EmbeddingModel, STORAGE_KEYS } from "./types";

// A vector database implementation with configurable embedding models
class VectorDatabase {
  private entries: VectorEntry[] = [];
  private currentModel: EmbeddingModel | null = null;

  constructor() {
    // Try to load the current embedding model from local storage
    this.loadEmbeddingModel();
  }

  private loadEmbeddingModel() {
    try {
      const storedModel = localStorage.getItem(STORAGE_KEYS.EMBEDDING_MODEL);
      if (storedModel) {
        this.currentModel = JSON.parse(storedModel);
        console.log(`Loaded embedding model: ${this.currentModel.name}`);
      } else {
        // Default model if none is configured
        this.currentModel = {
          id: "openai-text-embedding-3-small",
          name: "OpenAI Text Embedding 3 Small",
          provider: "openai",
          dimensions: 1536,
          status: "active",
          isDefault: true
        };
      }
    } catch (error) {
      console.error("Error loading embedding model:", error);
      // Default model as fallback
      this.currentModel = {
        id: "openai-text-embedding-3-small",
        name: "OpenAI Text Embedding 3 Small",
        provider: "openai",
        dimensions: 1536,
        status: "active",
        isDefault: true
      };
    }
  }

  // Add an entry to the database
  public addEntry(entry: VectorEntry): void {
    this.entries.push(entry);
  }

  // Get the current embedding model name
  public getCurrentModelName(): string {
    return this.currentModel?.name || "Default Model";
  }

  // Generate embeddings using the configured model
  // In a real implementation, this would call an API
  public generateEmbedding(text: string): number[] {
    console.log(`Generating embedding with model: ${this.currentModel?.name}`);
    
    // This is a simplified embedding generation for demo purposes
    // In reality, we would call the appropriate API based on the model
    const dimensions = this.currentModel?.dimensions || 1536;
    const hash = Array.from(text)
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    
    // Generate a vector with the specified dimensions
    return Array(dimensions).fill(0).map((_, i) => 
      Math.sin(hash * (i + 1) * 0.1) * 0.5 + 0.5
    );
  }

  // Search for similar entries using cosine similarity
  public search(embedding: number[], limit: number = 5): SearchResult[] {
    if (this.entries.length === 0) {
      return [];
    }

    // Calculate similarity scores (cosine similarity)
    const results = this.entries.map(entry => {
      const similarity = this.cosineSimilarity(embedding, entry.embedding);
      return { entry, similarity };
    });

    // Sort by similarity (descending) and take the top results
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    // If dimensions don't match, use only the dimensions that are present in both
    const minDimensions = Math.min(vecA.length, vecB.length);
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < minDimensions; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)) || 0;
  }

  // Initialize with some knowledge entries
  public initializeWithKnowledge(): void {
    const knowledgeEntries = [
      "The vector database architecture uses embedding standardization to normalize vectors to unit length.",
      "Cross-platform embedding strategy handles embeddings from different AI platforms with varying vector spaces.",
      "The two-way vector access system allows bidirectional traversal between queries and responses across platforms.",
      "Query processing pipeline includes stages for coarse retrieval, re-ranking, and diversity injection.",
      "The data model includes core entities like Interactions, Users, and Knowledge Entities.",
      "The system implements HNSW (Hierarchical Navigable Small World) as the primary index for vector search.",
      "Embedding management includes cross-platform alignment training and regular retraining of transformation matrices.",
      "The system uses tiered storage with hot storage for recent vectors, warm storage for moderately accessed vectors, and cold storage for historical vectors.",
      "Privacy and security measures include data isolation, anonymization techniques, and a compliance framework.",
      "Performance optimization includes query planning, caching strategies, and approximate query processing."
    ];

    knowledgeEntries.forEach(content => {
      const embedding = this.generateEmbedding(content);
      this.addEntry({
        id: crypto.randomUUID(),
        content,
        embedding
      });
    });
  }
}

// Create and export a singleton instance
export const vectorDb = new VectorDatabase();

// Initialize with sample knowledge
vectorDb.initializeWithKnowledge();
