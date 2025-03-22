
import { VectorEntry, SearchResult } from "./types";

// A simple in-memory vector database for demo purposes
class VectorDatabase {
  private entries: VectorEntry[] = [];

  // Add an entry to the database
  public addEntry(entry: VectorEntry): void {
    this.entries.push(entry);
  }

  // Generate a simple embedding for demo purposes
  // In a real implementation, this would call an embedding API
  public generateEmbedding(text: string): number[] {
    // This is a very naive "embedding" for demonstration only
    // Real embeddings would use models like OpenAI's text-embedding-ada-002
    const hash = Array.from(text)
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    
    // Generate a 10-dimensional vector based on the text hash
    return Array(10).fill(0).map((_, i) => 
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
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must have the same dimensions");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
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
