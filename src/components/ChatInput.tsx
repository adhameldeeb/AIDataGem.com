
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = scrollHeight + "px";
    }
  }, [input]);

  return (
    <div className="p-4 border-t bg-card/80 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit}
        className="flex items-end space-x-2 max-w-3xl mx-auto"
      >
        <div className="relative flex-1 border rounded-lg bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className={cn(
              "w-full resize-none bg-transparent px-4 py-3 border-0 outline-none",
              "max-h-[200px] min-h-[56px]"
            )}
            rows={1}
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !input.trim()}
          className="h-[56px] w-[56px] shrink-0 rounded-full transition-opacity"
        >
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
