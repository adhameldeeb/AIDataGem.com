
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Server, Layers, Network, Workflow } from "lucide-react";
import SystemDiagrams, { SYSTEM_DIAGRAMS } from "@/components/SystemDiagrams";

const ArchitecturePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AIDatagem System Architecture</h1>
            <p className="text-gray-600 mb-6">
              A deep dive into how AIDatagem works under the hood to transform your LLM conversations into actionable insights.
            </p>
            <div className="flex gap-3">
              <Link to="/documentation">
                <Button className="gap-2">
                  View Documentation
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Diagrams */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">System Visualization</h2>
          <SystemDiagrams />
        </div>

        {/* Architecture Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Vector Database
              </CardTitle>
              <CardDescription>
                Efficient storage and retrieval of embeddings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                AIDatagem uses a specialized vector database to store and query embeddings. This enables semantic search capabilities and similarity matching across your entire conversation history.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span>HNSW indexing for fast approximate nearest neighbor search</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span>Cosine similarity for semantic matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span>Configurable dimensionality based on embedding model</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Edge Functions
              </CardTitle>
              <CardDescription>
                Serverless compute for API integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our serverless edge functions handle API integrations, data processing, and secure communication with LLM providers, all without exposing your API keys to the client.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span>Secure API key management for multiple LLM providers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span>Distributed processing for handling large data volumes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span>Real-time data processing pipelines</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Embedding Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We support multiple embedding models to optimize for different use cases. The default model is OpenAI's text-embedding-3-small, which provides a good balance of quality and performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                API Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our API allows for seamless integration with your existing workflows. You can automatically capture conversations from multiple LLM providers and access your data programmatically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-primary" />
                Analysis Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our analysis pipeline includes steps for data extraction, cleaning, embedding generation, sentiment analysis, topic extraction, and metadata enrichment to provide comprehensive insights.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Specifications */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Frontend:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• React with TypeScript</li>
                <li>• TailwindCSS for styling</li>
                <li>• React Query for data fetching</li>
                <li>• Recharts for data visualization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Backend:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Supabase for database and authentication</li>
                <li>• Edge Functions for serverless compute</li>
                <li>• pgvector extension for vector storage</li>
                <li>• Row-level security for data protection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-700 mb-4">
            Set up your own instance of AIDatagem and start extracting value from your LLM conversations today.
          </p>
          <div className="flex gap-3">
            <Link to="/documentation">
              <Button className="gap-2">
                View Documentation
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="gap-2">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitecturePage;
