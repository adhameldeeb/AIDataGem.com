
import React, { useState } from "react";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/lib/hooks";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  Database, 
  Zap, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Upload,
  Layers,
  Search,
  Settings,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [useCase, setUseCase] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleEarlyAccessSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Early access signup:", { email, source, useCase });
    setSubmitted(true);
    toast({
      title: "Early access application received",
      description: "Thank you for your interest. We'll be in touch soon with your invitation.",
    });
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setSource("");
      setUseCase("");
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto bg-card shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            AIDatagem
          </h1>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-6">
          <h2 className="text-3xl font-bold">Never Lose Your AI Conversations Again</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Unify all your ChatGPT, Claude, and Gemini conversations in one powerful, searchable knowledge base.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start space-x-2">
            <Upload className="h-5 w-5 text-emerald-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Import All Conversations</h3>
              <p className="text-sm text-muted-foreground">From ChatGPT, Claude, Gemini, and more</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Search className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Semantic Search</h3>
              <p className="text-sm text-muted-foreground">Find insights across your entire history</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Layers className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Intelligent Analysis</h3>
              <p className="text-sm text-muted-foreground">Discover patterns in your AI interactions</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-muted/40 p-4 rounded-lg border">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium">Stop Losing Valuable Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              ChatGPT's memory is limited. Your best conversations 
              <span className="font-semibold"> disappear over time</span>, 
              and there's no way to search across your history.
              AIDatagem preserves everything, forever.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-rose-500" />
              <h3 className="font-medium">One Hub For All AI Models</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Using multiple AI tools? We capture conversations from
              <span className="font-semibold"> ChatGPT, Claude, Gemini, Grok</span> and more.
              No more switching between platforms to find that perfect response.
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-xl font-bold mb-4">Are You Leveraging Your AI Conversations?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col space-y-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                <Database className="h-5 w-5" />
                <span className="font-medium">Knowledge Repository</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Build your personal knowledge base from all your AI interactions
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <Search className="h-5 w-5" />
                <span className="font-medium">Advanced Search</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Find concepts and ideas across your entire conversation history
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <Settings className="h-5 w-5" />
                <span className="font-medium">API Connections</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Route all AI conversations through one unified interface
              </p>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <h4 className="font-semibold">Leverage Your AI Data in 3 Simple Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Export:</span> Download your existing conversations from ChatGPT and other platforms
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Import:</span> Upload into AIDatagem's secure cloud storage
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Analyze:</span> Search, visualize, and extract insights from your AI knowledge base
              </li>
            </ol>
          </div>
          
          <div className="mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Get Early Access Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Early Access Application</DialogTitle>
                  <DialogDescription>
                    Join our early access program to be among the first to organize and leverage your AI conversations.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEarlyAccessSignup}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Which AI platforms do you use?</Label>
                      <Input
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="ChatGPT, Claude, Gemini, etc."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="use-case">What would you like to achieve with AIDatagem?</Label>
                      <Textarea
                        id="use-case"
                        value={useCase}
                        onChange={(e) => setUseCase(e.target.value)}
                        placeholder="E.g., 'Find past coding solutions' or 'Organize research conversations'"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-xs">
                        <Star className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-1">Early Access Benefits:</p>
                          <ul className="list-disc list-inside space-y-1 ml-1">
                            <li>First 100 users: Free lifetime access to Pro features</li>
                            <li>Direct access to the founding team for support</li>
                            <li>Shape the product roadmap with your feedback</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    {submitted ? (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span>Application submitted!</span>
                      </div>
                    ) : (
                      <Button type="submit">Submit application</Button>
                    )}
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold mb-2">Choose Your Plan:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-3 bg-white dark:bg-slate-800">
                <div className="font-medium">Basic</div>
                <div className="text-2xl font-bold mt-1">Free</div>
                <div className="text-xs text-muted-foreground mb-3">Get started</div>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Import up to 500 conversations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Basic search functionality</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Export 10 conversations/month</span>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-md p-3 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700">
                <div className="font-medium text-indigo-700 dark:text-indigo-300">Pro</div>
                <div className="text-2xl font-bold mt-1">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <div className="text-xs text-muted-foreground mb-3">Most popular</div>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Unlimited conversation imports</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Advanced semantic search</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>API integration (up to 3 LLMs)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Unlimited exports</span>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-md p-3 bg-white dark:bg-slate-800">
                <div className="font-medium text-emerald-700 dark:text-emerald-300">Enterprise</div>
                <div className="text-2xl font-bold mt-1">$29.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <div className="text-xs text-muted-foreground mb-3">Full power</div>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Team collaboration features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Custom embedding models</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Workflow automation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Developer API access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg border">
          <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">How do I export my ChatGPT conversations?</h4>
              <p className="text-sm text-muted-foreground">We provide a step-by-step guide to help you export from all major AI platforms. For ChatGPT, you can download your data from account settings.</p>
            </div>
            <div>
              <h4 className="font-medium">Is my data secure?</h4>
              <p className="text-sm text-muted-foreground">Yes! All your conversations are encrypted in transit and at rest. We use the same security standards as major banks.</p>
            </div>
            <div>
              <h4 className="font-medium">Can I integrate with custom AI models?</h4>
              <p className="text-sm text-muted-foreground">Enterprise users can integrate with any API-accessible LLM, including custom-trained models specific to your needs.</p>
            </div>
            <div>
              <h4 className="font-medium">What about context windows?</h4>
              <p className="text-sm text-muted-foreground">AIDatagem has no context limits. Your entire conversation history is always available for search and analysis.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative flex flex-col flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
