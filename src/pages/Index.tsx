
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
    <div className="flex flex-col w-full h-full bg-white">
      <div className="p-6 md:p-8 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold gradient-text">
              AIDatagem
            </h1>
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="shadow-sm">
                <BarChart className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="mb-12">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-heading-1 mb-4 text-foreground">Never Lose Your AI Conversations Again</h2>
              <p className="text-xl text-muted-foreground leading-relaxed mx-auto readable-width">
                Unify all your ChatGPT, Claude, and Gemini conversations in one powerful, searchable knowledge base.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-soft border border-border card-hover">
                <div className="flex items-start space-x-3 mb-3">
                  <Upload className="h-6 w-6 text-emerald-500 mt-0.5" />
                  <div>
                    <h3 className="font-display font-semibold text-lg">Import All Conversations</h3>
                    <p className="text-muted-foreground">From ChatGPT, Claude, Gemini, and more</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-soft border border-border card-hover">
                <div className="flex items-start space-x-3 mb-3">
                  <Search className="h-6 w-6 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-display font-semibold text-lg">Semantic Search</h3>
                    <p className="text-muted-foreground">Find insights across your entire history</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-soft border border-border card-hover">
                <div className="flex items-start space-x-3 mb-3">
                  <Layers className="h-6 w-6 text-purple-500 mt-0.5" />
                  <div>
                    <h3 className="font-display font-semibold text-lg">Intelligent Analysis</h3>
                    <p className="text-muted-foreground">Discover patterns in your AI interactions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
              <div className="bg-secondary/20 rounded-xl p-6 border border-border">
                <div className="flex items-center space-x-3 mb-3">
                  <MessageSquare className="h-6 w-6 text-amber-500 flex-shrink-0" />
                  <h3 className="font-display font-semibold text-lg">Stop Losing Valuable Insights</h3>
                </div>
                <p className="text-muted-foreground">
                  ChatGPT's memory is limited. Your best conversations 
                  <span className="font-semibold text-foreground"> disappear over time</span>, 
                  and there's no way to search across your history.
                  AIDatagem preserves everything, forever.
                </p>
              </div>
              
              <div className="bg-secondary/20 rounded-xl p-6 border border-border">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="h-6 w-6 text-rose-500 flex-shrink-0" />
                  <h3 className="font-display font-semibold text-lg">One Hub For All AI Models</h3>
                </div>
                <p className="text-muted-foreground">
                  Using multiple AI tools? We capture conversations from
                  <span className="font-semibold text-foreground"> ChatGPT, Claude, Gemini, Grok</span> and more.
                  No more switching between platforms to find that perfect response.
                </p>
              </div>
            </div>
            
            <div className="mt-12 p-6 rounded-xl border bg-white shadow-card max-w-4xl mx-auto">
              <h3 className="text-heading-3 mb-6">Are You Leveraging Your AI Conversations?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-2 text-indigo-600">
                    <Database className="h-5 w-5" />
                    <span className="font-medium">Knowledge Repository</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Build your personal knowledge base from all your AI interactions
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <Search className="h-5 w-5" />
                    <span className="font-medium">Advanced Search</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Find concepts and ideas across your entire conversation history
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-2 text-amber-600">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">API Connections</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Route all AI conversations through one unified interface
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="font-display font-semibold mb-3">Leverage Your AI Data in 3 Simple Steps:</h4>
                <ol className="space-y-2 text-sm bg-secondary/20 p-4 rounded-lg">
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <div>
                      <span className="font-medium text-foreground">Export:</span> 
                      <span className="text-muted-foreground"> Download your existing conversations from ChatGPT and other platforms</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <div>
                      <span className="font-medium text-foreground">Import:</span> 
                      <span className="text-muted-foreground"> Upload into AIDatagem's secure cloud storage</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <div>
                      <span className="font-medium text-foreground">Analyze:</span> 
                      <span className="text-muted-foreground"> Search, visualize, and extract insights from your AI knowledge base</span>
                    </div>
                  </li>
                </ol>
              </div>
              
              <div className="flex justify-center mb-10">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium px-8 py-6 h-auto">
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
                          <div className="flex items-start p-3 rounded-md bg-amber-50 text-amber-800 text-xs">
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
                          <div className="flex items-center text-green-600">
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
              
              <div className="border-t pt-8">
                <h4 className="font-display font-semibold mb-4">Choose Your Plan:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-xl p-5 bg-white shadow-soft relative animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <div className="font-medium text-lg mb-2">Basic</div>
                    <div className="text-3xl font-bold mb-1">Free</div>
                    <div className="text-xs text-muted-foreground mb-4">Get started</div>
                    <ul className="text-sm space-y-3 mb-4">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Import up to 500 conversations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Basic search functionality</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Export 10 conversations/month</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full mt-auto">Start Free</Button>
                  </div>
                  
                  <div className="border-2 border-primary rounded-xl p-5 bg-white shadow-card relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <div className="absolute -top-3 right-5 bg-primary text-white text-xs py-1 px-3 rounded-full">Most Popular</div>
                    <div className="font-medium text-lg text-primary mb-2">Pro</div>
                    <div className="text-3xl font-bold mb-1">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                    <div className="text-xs text-muted-foreground mb-4">Unlimited access</div>
                    <ul className="text-sm space-y-3 mb-4">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Unlimited conversation imports</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Advanced semantic search</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>API integration (up to 3 LLMs)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Unlimited exports</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-auto">Get Started</Button>
                  </div>
                  
                  <div className="border rounded-xl p-5 bg-white shadow-soft relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <div className="font-medium text-lg text-emerald-700 mb-2">Enterprise</div>
                    <div className="text-3xl font-bold mb-1">$29.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                    <div className="text-xs text-muted-foreground mb-4">Full power</div>
                    <ul className="text-sm space-y-3 mb-4">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Everything in Pro</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Team collaboration features</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Custom embedding models</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Workflow automation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Developer API access</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full mt-auto">Contact Sales</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 rounded-xl border bg-white shadow-soft max-w-4xl mx-auto">
              <h3 className="text-heading-3 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-5">
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">How do I export my ChatGPT conversations?</h4>
                  <p className="text-sm text-muted-foreground">We provide a step-by-step guide to help you export from all major AI platforms. For ChatGPT, you can download your data from account settings.</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Is my data secure?</h4>
                  <p className="text-sm text-muted-foreground">Yes! All your conversations are encrypted in transit and at rest. We use the same security standards as major banks.</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Can I integrate with custom AI models?</h4>
                  <p className="text-sm text-muted-foreground">Enterprise users can integrate with any API-accessible LLM, including custom-trained models specific to your needs.</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What about context windows?</h4>
                  <p className="text-sm text-muted-foreground">AIDatagem has no context limits. Your entire conversation history is always available for search and analysis.</p>
                </div>
              </div>
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
