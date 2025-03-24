
import React, { useEffect, useRef } from "react";
import { ChatMessage, LoadingMessage } from "@/components/ChatMessage";
import { Message } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Hash, Layers } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Group messages by project and conversation
  const groupedMessages = React.useMemo(() => {
    const groups = new Map<string, Message[]>();
    
    messages.forEach(message => {
      // Group by conversation ID, session ID, or timestamp date if not available
      const groupKey = message.metadata?.conversationId || 
                       message.metadata?.sessionId || 
                       message.timestamp.toISOString().split('T')[0];
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      
      const messageGroup = groups.get(groupKey);
      if (messageGroup) {
        messageGroup.push(message);
      }
    });
    
    return Array.from(groups.entries()).map(([key, msgs]) => ({
      id: key,
      messages: msgs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
      project: msgs[0]?.metadata?.project || "Uncategorized",
      subject: msgs[0]?.metadata?.subject || undefined,
      date: msgs[0]?.timestamp
    }));
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto py-4 bg-slate-900">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-4">
            <h3 className="text-xl font-semibold">Welcome to AIDatagem</h3>
            <p className="text-muted-foreground">
              Discover the hidden gems in your data. Ask questions, and let our AI 
              reveal valuable insights from your information.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedMessages.map((group) => (
            <div key={group.id} className="space-y-4">
              <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm p-2 flex items-center gap-3 border-b border-slate-800">
                <div className="flex-1">
                  {group.project && (
                    <Badge 
                      variant="outline" 
                      className="mr-2 bg-indigo-950/50 text-indigo-300 hover:bg-indigo-900/50 border-indigo-800"
                    >
                      <Layers className="h-3 w-3 mr-1" />
                      {group.project}
                    </Badge>
                  )}
                  {group.subject && (
                    <Badge 
                      variant="outline" 
                      className="mr-2 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/50 border-emerald-800"
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {group.subject}
                    </Badge>
                  )}
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {group.date?.toLocaleDateString() || "Unknown date"}
                </Badge>
              </div>
              
              {group.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          ))}
          {isLoading && <LoadingMessage />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
