
import React, { useState } from "react";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/lib/hooks";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  Layers, 
  Zap, 
  Hourglass, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingBag, 
  Tag, 
  Package, 
  Truck, 
  Search, 
  Store, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SecretsManager } from "@/components/SecretsManager";

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [useCase, setUseCase] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleEarlyAccessSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Early access signup:", { email, business, useCase });
    setSubmitted(true);
    toast({
      title: "Early access application received",
      description: "Thank you for your interest. We'll be in touch to discuss your custom onboarding.",
    });
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setBusiness("");
      setUseCase("");
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto bg-card shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            RetailGPT Hub
          </h1>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-6">
          <h2 className="text-3xl font-bold">Get Priority Access to RetailGPT Hub</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Transform your retail business with customized AI onboarding – unify all your LLM tools in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start space-x-2">
            <ShoppingBag className="h-5 w-5 text-emerald-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Product Description Generator</h3>
              <p className="text-sm text-muted-foreground">Create SEO-friendly listings across all your channels</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Tag className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Competitor Price Tracker</h3>
              <p className="text-sm text-muted-foreground">Stay competitive with automated market analysis</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Package className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Inventory Optimizer</h3>
              <p className="text-sm text-muted-foreground">Smart restocking recommendations to maximize profits</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-muted/40 p-4 rounded-lg border">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium">Multiple LLMs, One Platform</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Stop switching between ChatGPT, Perplexity, Claude, and Gemini. 
              Manage all your AI assistants in <span className="font-semibold">one unified dashboard</span> 
              designed specifically for retail needs.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-rose-500" />
              <h3 className="font-medium">Retail-Specific Templates</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Pre-built workflows for common retail tasks: product research, 
              customer support automation, and inventory management - no coding required.
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-xl font-bold mb-4">Why Join Early?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col space-y-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Priority Support</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Dedicated onboarding specialists to help you get started
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <Store className="h-5 w-5" />
                <span className="font-medium">Shopify Integration</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Seamlessly connect with your store for product data analysis
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <Search className="h-5 w-5" />
                <span className="font-medium">Custom Training</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Fine-tune AI models to your specific product catalog
              </p>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <h4 className="font-semibold">How It Works – 3 Simple Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Sign Up:</span> Reserve your spot in minutes
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Customize:</span> Tell us your retail goals
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Onboard:</span> Get tailored training + ongoing support
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
                    Join our early access program for RetailGPT Hub. We're offering personalized onboarding and training for our first 50 customers.
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
                      <Label htmlFor="business">Business Name</Label>
                      <Input
                        id="business"
                        value={business}
                        onChange={(e) => setBusiness(e.target.value)}
                        placeholder="Your retail business name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="use-case">What would you like to achieve with RetailGPT Hub?</Label>
                      <Textarea
                        id="use-case"
                        value={useCase}
                        onChange={(e) => setUseCase(e.target.value)}
                        placeholder="E.g., 'Generate product descriptions for my Shopify store' or 'Track competitor prices'"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-xs">
                        <Truck className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-1">Early Access Timeline:</p>
                          <ul className="list-disc list-inside space-y-1 ml-1">
                            <li>First 50 users: Immediate access + priority support</li>
                            <li>Custom integrations: Starting next month</li>
                            <li>Full public release: Coming soon</li>
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
            <h4 className="font-semibold mb-2">Pricing Plans:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-3 bg-white dark:bg-slate-800">
                <div className="font-medium">Free</div>
                <div className="text-2xl font-bold mt-1">$0</div>
                <div className="text-xs text-muted-foreground mb-3">Basic features</div>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>5 AI requests per day</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Basic product templates</span>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-md p-3 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700">
                <div className="font-medium text-indigo-700 dark:text-indigo-300">Pro</div>
                <div className="text-2xl font-bold mt-1">$29<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <div className="text-xs text-muted-foreground mb-3">Most popular</div>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Unlimited AI requests</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>All retail templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Custom LLM integration</span>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-md p-3 bg-white dark:bg-slate-800">
                <div className="font-medium text-emerald-700 dark:text-emerald-300">Shopify</div>
                <div className="text-2xl font-bold mt-1">$99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <div className="text-xs text-muted-foreground mb-3">Full integration</div>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Shopify/WooCommerce sync</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span>Competitor price tracking</span>
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
              <h4 className="font-medium">What's the commitment?</h4>
              <p className="text-sm text-muted-foreground">No contracts – cancel anytime. Early access is risk-free.</p>
            </div>
            <div>
              <h4 className="font-medium">How is onboarding customized?</h4>
              <p className="text-sm text-muted-foreground">Tell us your goals during sign-up, and we'll design your training path.</p>
            </div>
            <div>
              <h4 className="font-medium">Will I get support?</h4>
              <p className="text-sm text-muted-foreground">Yes! Dedicated specialists ensure you get the most from your experience.</p>
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
