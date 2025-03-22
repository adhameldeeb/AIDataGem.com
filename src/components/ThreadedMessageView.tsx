
import React, { useState, useMemo } from "react";
import { Message } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface ThreadedMessageViewProps {
  messages: Message[];
}

export function ThreadedMessageView({ messages }: ThreadedMessageViewProps) {
  // Group messages by conversation ID
  const groupedMessages = useMemo(() => {
    const groups = new Map<string, Message[]>();
    
    // Group by conversation ID or by day if no conversation ID
    messages.forEach(message => {
      const groupKey = message.metadata?.conversationId || 
                    format(message.timestamp, "yyyy-MM-dd");
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      
      groups.get(groupKey)?.push(message);
    });
    
    // Sort messages within each group by timestamp
    return Array.from(groups.entries()).map(([key, msgs]) => ({
      id: key,
      title: key.startsWith("conv-") || key === "live-session" 
        ? `Conversation ${key.substring(0, 8)}` 
        : `Messages from ${format(new Date(key), "MMMM d, yyyy")}`,
      messages: msgs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    }));
  }, [messages]);

  return (
    <div className="space-y-4">
      {groupedMessages.map(group => (
        <ConversationGroup key={group.id} group={group} />
      ))}
    </div>
  );
}

interface ConversationGroupProps {
  group: {
    id: string;
    title: string;
    messages: Message[];
  };
}

function ConversationGroup({ group }: ConversationGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card>
      <CardHeader className="py-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <CardTitle className="text-base">{group.title}</CardTitle>
            <Badge variant="outline">{group.messages.length} messages</Badge>
          </div>
        </div>
      </CardHeader>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-3">
              {group.messages.map(message => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function MessageItem({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(false);
  
  const roleColors = {
    user: "bg-blue-100 text-blue-800",
    assistant: "bg-green-100 text-green-800",
    system: "bg-gray-100 text-gray-800"
  };
  
  const shortContent = message.content.length > 150 
    ? message.content.substring(0, 150) + "..." 
    : message.content;
  
  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[message.role]}`}>
            {message.role}
          </span>
          {message.metadata?.owner && (
            <span className="text-xs text-muted-foreground">
              by {message.metadata.owner}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {format(message.timestamp, "MMM d, yyyy h:mm a")}
        </span>
      </div>
      
      <div className="text-sm whitespace-pre-wrap">
        {expanded ? message.content : shortContent}
      </div>
      
      {message.content.length > 150 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
}
