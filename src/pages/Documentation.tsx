
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Book, FileText, Download, Database, Zap, MessageSquare, Settings, Info, Home } from "lucide-react";

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("getting-started");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 text-primary">
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>
            <div className="flex gap-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
          
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AIDatagem Documentation</h1>
            <p className="text-gray-600 mb-6">
              Comprehensive guides to help you leverage your chat history and extract maximum value from 
              your conversations with LLMs like ChatGPT, Claude, and others.
            </p>
            <div className="flex gap-3">
              <Link to="#getting-started">
                <Button className="gap-2">
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="https://github.com/your-repo/aidatagem" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  GitHub <FileText className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Documentation
            </h3>
            <ul className="space-y-1">
              <li>
                <a 
                  href="#getting-started"
                  className={`block px-3 py-2 rounded-md ${activeTab === "getting-started" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("getting-started")}
                >
                  Getting Started
                </a>
              </li>
              <li>
                <a 
                  href="#uploading-data"
                  className={`block px-3 py-2 rounded-md ${activeTab === "uploading-data" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("uploading-data")}
                >
                  Uploading Your Data
                </a>
              </li>
              <li>
                <a 
                  href="#analyzing-chats"
                  className={`block px-3 py-2 rounded-md ${activeTab === "analyzing-chats" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("analyzing-chats")}
                >
                  Analyzing Chat History
                </a>
              </li>
              <li>
                <a 
                  href="#ai-insights"
                  className={`block px-3 py-2 rounded-md ${activeTab === "ai-insights" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("ai-insights")}
                >
                  AI-Powered Insights
                </a>
              </li>
              <li>
                <a 
                  href="#visualizations"
                  className={`block px-3 py-2 rounded-md ${activeTab === "visualizations" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("visualizations")}
                >
                  Visualizations
                </a>
              </li>
              <li>
                <a 
                  href="#api-integration"
                  className={`block px-3 py-2 rounded-md ${activeTab === "api-integration" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("api-integration")}
                >
                  API Integration
                </a>
              </li>
              <li>
                <a 
                  href="#advanced-features"
                  className={`block px-3 py-2 rounded-md ${activeTab === "advanced-features" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("advanced-features")}
                >
                  Advanced Features
                </a>
              </li>
              <li>
                <a 
                  href="#faq"
                  className={`block px-3 py-2 rounded-md ${activeTab === "faq" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("faq")}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <section id="getting-started" className={activeTab === "getting-started" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Getting Started with AIDatagem</CardTitle>
                <CardDescription>Learn how to set up and start using AIDatagem to analyze your LLM conversations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h3>Welcome to AIDatagem</h3>
                  <p>
                    AIDatagem helps you extract valuable insights from your conversations with AI language models like ChatGPT, Claude, Gemini, and others. This guide will help you get started quickly.
                  </p>

                  <h4>Step 1: Create an Account</h4>
                  <p>
                    Start by creating an account on AIDatagem. Click the "Sign Up" button on the homepage and follow the instructions to create your account.
                  </p>

                  <h4>Step 2: Connect to Your Supabase Database</h4>
                  <p>
                    AIDatagem uses Supabase for secure data storage. You'll need to provide your Supabase credentials in the Dashboard settings to connect your database.
                  </p>

                  <h4>Step 3: Import Your Chat History</h4>
                  <p>
                    You can import your existing chat history from various platforms. We support direct imports from:
                  </p>
                  <ul>
                    <li>OpenAI ChatGPT (via JSON export)</li>
                    <li>Anthropic Claude</li>
                    <li>Google Gemini</li>
                    <li>Custom formats (via our API)</li>
                  </ul>

                  <h4>Step 4: Explore Your Data</h4>
                  <p>
                    Once your data is imported, you can explore it through various visualizations, search through your history, and start extracting insights.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
                    <h4 className="text-blue-700 flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5" />
                      Pro Tip
                    </h4>
                    <p className="text-blue-700">
                      To get the most out of AIDatagem, we recommend importing at least 100 conversations. This gives our AI enough data to generate meaningful insights.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="uploading-data" className={activeTab === "uploading-data" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Uploading Your Data</CardTitle>
                <CardDescription>Learn how to import your chat history from various platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h3>Importing Your Chat History</h3>
                  <p>
                    AIDatagem supports multiple methods for importing your conversation history with LLMs.
                  </p>

                  <h4>Method 1: Direct Upload</h4>
                  <p>
                    The easiest way to import your data is to export your chat history from your LLM platform and upload the file directly to AIDatagem.
                  </p>
                  <ol>
                    <li>Go to the Dashboard and select the "Upload" tab.</li>
                    <li>Click "Upload Files" and select your exported chat history files.</li>
                    <li>AIDatagem will process your files and extract the conversations.</li>
                  </ol>

                  <h4>Method 2: API Integration</h4>
                  <p>
                    For advanced users, we offer API integration to automatically capture your conversations in real-time.
                  </p>
                  <ol>
                    <li>Set up your API key in the "Settings" tab.</li>
                    <li>Follow our integration guide to connect your LLM workflows to AIDatagem.</li>
                    <li>Your conversations will be automatically captured and analyzed.</li>
                  </ol>

                  <h4>Supported File Formats</h4>
                  <ul>
                    <li><strong>ChatGPT JSON exports</strong> - Directly exported from chat.openai.com</li>
                    <li><strong>Claude conversation history</strong> - Exported from Anthropic's platform</li>
                    <li><strong>Gemini chat logs</strong> - From Google's Gemini platform</li>
                    <li><strong>Custom JSON format</strong> - Follow our schema for custom imports</li>
                  </ul>

                  <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                    <h4 className="text-yellow-700 flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5" />
                      Important Note
                    </h4>
                    <p className="text-yellow-700">
                      Make sure your data is in the correct format before uploading. Incorrectly formatted files may not be processed correctly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="analyzing-chats" className={activeTab === "analyzing-chats" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Analyzing Chat History</CardTitle>
                <CardDescription>Learn how to extract insights from your conversations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h3>Understanding Your Data</h3>
                  <p>
                    Once your data is imported, AIDatagem provides several tools to analyze and understand your conversations.
                  </p>

                  <h4>Message Table View</h4>
                  <p>
                    The Message Table view shows all your conversations in a structured format. You can:
                  </p>
                  <ul>
                    <li>Search through your entire chat history</li>
                    <li>Filter by date, model, or conversation topic</li>
                    <li>Sort conversations by various metrics</li>
                    <li>Export filtered results for further analysis</li>
                  </ul>

                  <h4>Threaded View</h4>
                  <p>
                    The Threaded View organizes your conversations by thread, making it easier to follow complex discussions:
                  </p>
                  <ul>
                    <li>See the full context of each conversation</li>
                    <li>Understand how topics evolve over time</li>
                    <li>Identify key moments in lengthy discussions</li>
                  </ul>

                  <h4>Semantic Search</h4>
                  <p>
                    Our vector-based semantic search goes beyond simple keyword matching:
                  </p>
                  <ul>
                    <li>Find conversations based on concepts, not just keywords</li>
                    <li>Discover related conversations you might have forgotten</li>
                    <li>Group similar topics across multiple chats</li>
                  </ul>

                  <div className="bg-green-50 p-4 rounded-lg mt-6">
                    <h4 className="text-green-700 flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5" />
                      Pro Tip
                    </h4>
                    <p className="text-green-700">
                      Use the embedding visualization to identify clusters of similar conversations. This can help you discover patterns in your data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="ai-insights" className={activeTab === "ai-insights" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">AI-Powered Insights</CardTitle>
                <CardDescription>Discover how AIDatagem uses AI to extract value from your conversations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h3>Advanced AI Analysis</h3>
                  <p>
                    AIDatagem doesn't just store your conversations - it analyzes them using advanced AI techniques to extract valuable insights.
                  </p>

                  <h4>Sentiment Analysis</h4>
                  <p>
                    Understand the emotional tone of your conversations:
                  </p>
                  <ul>
                    <li>Track sentiment across projects and time periods</li>
                    <li>Identify particularly positive or negative interactions</li>
                    <li>Analyze how sentiment changes within conversations</li>
                  </ul>

                  <h4>Topic Extraction</h4>
                  <p>
                    Automatically identify the main topics discussed in your conversations:
                  </p>
                  <ul>
                    <li>See what subjects appear most frequently</li>
                    <li>Track how topics evolve over time</li>
                    <li>Group conversations by topic for better organization</li>
                  </ul>

                  <h4>Knowledge Mining</h4>
                  <p>
                    Extract actionable knowledge from your conversations:
                  </p>
                  <ul>
                    <li>Identify key facts and insights</li>
                    <li>Extract code snippets and solutions</li>
                    <li>Create a searchable knowledge base from your chats</li>
                  </ul>

                  <h4>Metadata Enhancement</h4>
                  <p>
                    We automatically enrich your conversations with additional metadata:
                  </p>
                  <ul>
                    <li>Entity detection (people, organizations, etc.)</li>
                    <li>Category classification</li>
                    <li>Importance ranking</li>
                  </ul>

                  <div className="bg-purple-50 p-4 rounded-lg mt-6">
                    <h4 className="text-purple-700 flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5" />
                      Advanced Feature
                    </h4>
                    <p className="text-purple-700">
                      Premium users can access our "Insight Reports" feature, which provides a weekly summary of key insights and trends from your conversations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="visualizations" className={activeTab === "visualizations" ? "block" : "hidden"}>
            {/* Visualization documentation content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Visualizations</CardTitle>
                <CardDescription>Explore your data through powerful visualizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h3>Visual Data Exploration</h3>
                  <p>
                    AIDatagem provides several visualization tools to help you understand your data from different perspectives.
                  </p>

                  <h4>Embedding Visualization</h4>
                  <p>
                    The embedding visualization shows your conversations in a 2D space:
                  </p>
                  <ul>
                    <li>Similar conversations appear closer together</li>
                    <li>Identify clusters of related topics</li>
                    <li>Discover unexpected connections between conversations</li>
                  </ul>

                  <h4>Sentiment Timeline</h4>
                  <p>
                    Track how sentiment changes over time:
                  </p>
                  <ul>
                    <li>View sentiment trends by project or time period</li>
                    <li>Identify patterns in your interactions</li>
                    <li>Compare sentiment across different LLM platforms</li>
                  </ul>

                  <h4>Topic Distribution</h4>
                  <p>
                    See what topics dominate your conversations:
                  </p>
                  <ul>
                    <li>Pie charts showing topic distribution</li>
                    <li>Bar charts comparing topic frequency over time</li>
                    <li>Heat maps showing topic relationships</li>
                  </ul>

                  <h4>Interaction Patterns</h4>
                  <p>
                    Analyze how you interact with different LLMs:
                  </p>
                  <ul>
                    <li>Message length distribution</li>
                    <li>Response time analysis</li>
                    <li>Conversation flow diagrams</li>
                  </ul>

                  <div className="bg-indigo-50 p-4 rounded-lg mt-6">
                    <h4 className="text-indigo-700 flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5" />
                      Interactive Features
                    </h4>
                    <p className="text-indigo-700">
                      All visualizations are interactive. Click on data points to see the associated conversations and explore the data in more detail.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="api-integration" className={activeTab === "api-integration" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">API Integration</CardTitle>
                <CardDescription>Connect AIDatagem to your existing workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h3>API Documentation</h3>
                  <p>
                    AIDatagem provides a comprehensive API for integrating with your existing tools and workflows.
                  </p>

                  <h4>Authentication</h4>
                  <p>
                    All API requests require authentication using your API key:
                  </p>
                  <pre className="bg-gray-100 p-2 rounded"><code>
                    Authorization: Bearer YOUR_API_KEY
                  </code></pre>

                  <h4>Key Endpoints</h4>
                  <ul>
                    <li><code>/api/conversations</code> - Manage conversations</li>
                    <li><code>/api/messages</code> - Access individual messages</li>
                    <li><code>/api/search</code> - Semantic search across your data</li>
                    <li><code>/api/insights</code> - Generate AI-powered insights</li>
                  </ul>

                  <h4>Example: Recording a Conversation</h4>
                  <pre className="bg-gray-100 p-2 rounded"><code>
{`POST /api/conversations
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "title": "Conversation about ML models",
  "source": "openai",
  "messages": [
    {
      "role": "user",
      "content": "What's the difference between CNNs and RNNs?"
    },
    {
      "role": "assistant",
      "content": "CNNs (Convolutional Neural Networks) excel at spatial data like images..."
    }
  ]
}`}
                  </code></pre>

                  <h4>Webhook Integration</h4>
                  <p>
                    Set up webhooks to be notified when:
                  </p>
                  <ul>
                    <li>New conversations are added</li>
                    <li>Important insights are discovered</li>
                    <li>Processing of large imports is complete</li>
                  </ul>

                  <div className="bg-red-50 p-4 rounded-lg mt-6">
                    <h4 className="text-red-700 flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5" />
                      API Rate Limits
                    </h4>
                    <p className="text-red-700">
                      Free accounts are limited to 100 API requests per day. Premium accounts have higher limits based on their subscription level.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="advanced-features" className={activeTab === "advanced-features" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Advanced Features</CardTitle>
                <CardDescription>Take your data analysis to the next level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h3>Power User Features</h3>
                  <p>
                    AIDatagem offers several advanced features for power users who want to get the most out of their data.
                  </p>

                  <h4>Custom Embedding Models</h4>
                  <p>
                    Choose from multiple embedding models to optimize for your use case:
                  </p>
                  <ul>
                    <li>OpenAI text-embedding-3-small (default)</li>
                    <li>OpenAI text-embedding-3-large (premium)</li>
                    <li>Cohere Embed English v3.0</li>
                    <li>Custom models (Enterprise tier)</li>
                  </ul>

                  <h4>Project Management</h4>
                  <p>
                    Organize your conversations into projects:
                  </p>
                  <ul>
                    <li>Group related conversations together</li>
                    <li>Set project-specific analysis parameters</li>
                    <li>Generate project-level insights and reports</li>
                  </ul>

                  <h4>Data Export Options</h4>
                  <p>
                    Export your data in multiple formats:
                  </p>
                  <ul>
                    <li>JSON for further processing</li>
                    <li>CSV for spreadsheet analysis</li>
                    <li>PDF reports for sharing</li>
                    <li>Markdown for documentation</li>
                  </ul>

                  <h4>Custom Analysis Pipelines</h4>
                  <p>
                    Enterprise users can define custom analysis pipelines:
                  </p>
                  <ul>
                    <li>Create specialized insights for your domain</li>
                    <li>Set up automated workflows for data processing</li>
                    <li>Integrate with your existing ML infrastructure</li>
                  </ul>

                  <div className="bg-teal-50 p-4 rounded-lg mt-6">
                    <h4 className="text-teal-700 flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5" />
                      Enterprise Feature
                    </h4>
                    <p className="text-teal-700">
                      Enterprise customers can request custom feature development to meet their specific needs. Contact our sales team for more information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="faq" className={activeTab === "faq" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                <CardDescription>Answers to common questions about AIDatagem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How secure is my data with AIDatagem?</h4>
                    <p className="text-gray-700">
                      Your data is stored in your own Supabase instance with strict access controls. We use encryption for all sensitive data and never share your information with third parties.
                    </p>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Can I delete conversations after importing them?</h4>
                    <p className="text-gray-700">
                      Yes, you can delete individual conversations or bulk delete conversations that match certain criteria. Deleted data is permanently removed from our systems.
                    </p>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How much data can I store on the free plan?</h4>
                    <p className="text-gray-700">
                      Free accounts can store up to 1,000 messages. Premium accounts have higher limits based on their subscription level, starting at 10,000 messages for the Basic tier.
                    </p>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Do you support languages other than English?</h4>
                    <p className="text-gray-700">
                      Yes, AIDatagem supports multilingual conversations. Our embedding models can handle over 100 languages, and our UI is available in English, Spanish, French, German, and Japanese.
                    </p>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Can I share insights with my team?</h4>
                    <p className="text-gray-700">
                      Yes, Team and Enterprise plans support sharing insights, visualizations, and reports with team members. You can control access permissions for each team member.
                    </p>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How often is the data updated?</h4>
                    <p className="text-gray-700">
                      When using the API integration, data is updated in real-time. For file uploads, processing usually takes a few seconds to a few minutes depending on the size of the import.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Still have questions?</h4>
                  <p className="text-gray-700">
                    If you couldn't find the answer to your question, please contact our support team at 
                    <a href="mailto:support@aidatagem.com" className="text-primary hover:underline"> support@aidatagem.com</a>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
