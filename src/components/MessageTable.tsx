
import React, { useState, useMemo } from "react";
import { Message, MessageTableFilters, FilterOption } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  Search,
  Filter,
  Tag,
  User,
  Calendar,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";

interface MessageTableProps {
  messages: Message[];
}

export function MessageTable({ messages }: MessageTableProps) {
  const [filters, setFilters] = useState<MessageTableFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Extract filter options from messages
  const filterOptions = useMemo(() => {
    const options = {
      role: new Map<string, number>(),
      project: new Map<string, number>(),
      owner: new Map<string, number>(),
      taskManager: new Map<string, number>(),
      taskOwner: new Map<string, number>(),
      year: new Map<string, number>(),
      tags: new Map<string, number>(),
    };

    messages.forEach(message => {
      // Count roles
      options.role.set(message.role, (options.role.get(message.role) || 0) + 1);
      
      // Count years
      const year = message.timestamp.getFullYear().toString();
      options.year.set(year, (options.year.get(year) || 0) + 1);
      
      // Process metadata if available
      if (message.metadata) {
        if (message.metadata.project) {
          options.project.set(
            message.metadata.project,
            (options.project.get(message.metadata.project) || 0) + 1
          );
        }
        
        if (message.metadata.owner) {
          options.owner.set(
            message.metadata.owner,
            (options.owner.get(message.metadata.owner) || 0) + 1
          );
        }
        
        if (message.metadata.taskManager) {
          options.taskManager.set(
            message.metadata.taskManager,
            (options.taskManager.get(message.metadata.taskManager) || 0) + 1
          );
        }
        
        if (message.metadata.taskOwner) {
          options.taskOwner.set(
            message.metadata.taskOwner,
            (options.taskOwner.get(message.metadata.taskOwner) || 0) + 1
          );
        }
        
        // Process tags
        if (message.metadata.tags) {
          message.metadata.tags.forEach(tag => {
            options.tags.set(tag, (options.tags.get(tag) || 0) + 1);
          });
        }
      }
    });

    // Convert maps to arrays of options
    return {
      role: Array.from(options.role.entries()).map(([value, count]) => ({ 
        value, 
        label: value.charAt(0).toUpperCase() + value.slice(1), 
        count 
      })),
      project: Array.from(options.project.entries()).map(([value, count]) => ({ value, label: value, count })),
      owner: Array.from(options.owner.entries()).map(([value, count]) => ({ value, label: value, count })),
      taskManager: Array.from(options.taskManager.entries()).map(([value, count]) => ({ value, label: value, count })),
      taskOwner: Array.from(options.taskOwner.entries()).map(([value, count]) => ({ value, label: value, count })),
      year: Array.from(options.year.entries()).map(([value, count]) => ({ value, label: value, count })),
      tags: Array.from(options.tags.entries()).map(([value, count]) => ({ value, label: value, count })),
    };
  }, [messages]);

  // Apply filters to messages
  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      // Search term filter
      if (searchTerm && !message.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Role filter
      if (filters.role && filters.role.length > 0 && !filters.role.includes(message.role)) {
        return false;
      }
      
      // Year filter
      if (filters.year && filters.year.length > 0) {
        const messageYear = message.timestamp.getFullYear();
        if (!filters.year.includes(messageYear)) {
          return false;
        }
      }
      
      // Metadata filters
      if (message.metadata) {
        // Project filter
        if (filters.project && filters.project.length > 0) {
          if (!message.metadata.project || !filters.project.includes(message.metadata.project)) {
            return false;
          }
        }
        
        // Owner filter
        if (filters.owner && filters.owner.length > 0) {
          if (!message.metadata.owner || !filters.owner.includes(message.metadata.owner)) {
            return false;
          }
        }
        
        // Task Manager filter
        if (filters.taskManager && filters.taskManager.length > 0) {
          if (!message.metadata.taskManager || !filters.taskManager.includes(message.metadata.taskManager)) {
            return false;
          }
        }
        
        // Task Owner filter
        if (filters.taskOwner && filters.taskOwner.length > 0) {
          if (!message.metadata.taskOwner || !filters.taskOwner.includes(message.metadata.taskOwner)) {
            return false;
          }
        }
        
        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
          if (!message.metadata.tags || !message.metadata.tags.some(tag => filters.tags?.includes(tag))) {
            return false;
          }
        }
      } else if (
        (filters.project && filters.project.length > 0) ||
        (filters.owner && filters.owner.length > 0) ||
        (filters.taskManager && filters.taskManager.length > 0) ||
        (filters.taskOwner && filters.taskOwner.length > 0) ||
        (filters.tags && filters.tags.length > 0)
      ) {
        // If any metadata filter is active but message has no metadata
        return false;
      }
      
      return true;
    });
  }, [messages, filters, searchTerm]);

  // Helper function to render filter dropdowns
  const renderFilterDropdown = (
    title: string, 
    filterKey: keyof MessageTableFilters, 
    options: FilterOption[], 
    icon: React.ReactNode
  ) => {
    const selectedFilters = filters[filterKey] as string[] || [];
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {icon}
            {title}
            {selectedFilters.length > 0 && (
              <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                {selectedFilters.length}
              </span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.includes(option.value)}
              onCheckedChange={(checked) => {
                setFilters(prev => {
                  const current = [...(prev[filterKey] as string[] || [])];
                  if (checked) {
                    current.push(option.value);
                  } else {
                    const index = current.indexOf(option.value);
                    if (index !== -1) current.splice(index, 1);
                  }
                  return { ...prev, [filterKey]: current.length ? current : undefined };
                });
              }}
            >
              <span className="flex justify-between w-full">
                {option.label}
                <span className="text-muted-foreground">({option.count})</span>
              </span>
            </DropdownMenuCheckboxItem>
          ))}
          {options.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setFilters(prev => ({ ...prev, [filterKey]: undefined }));
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search message content..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {renderFilterDropdown("Role", "role", filterOptions.role, <Filter className="h-4 w-4" />)}
          {renderFilterDropdown("Project", "project", filterOptions.project, <Briefcase className="h-4 w-4" />)}
          {renderFilterDropdown("Owner", "owner", filterOptions.owner, <User className="h-4 w-4" />)}
          {renderFilterDropdown("Tags", "tags", filterOptions.tags, <Tag className="h-4 w-4" />)}
          {renderFilterDropdown("Year", "year", filterOptions.year, <Calendar className="h-4 w-4" />)}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="w-[80px]">Role</TableHead>
              <TableHead className="w-[120px]">Project</TableHead>
              <TableHead className="w-[120px]">Owner</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-[100px]">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-mono text-xs">
                    {format(message.timestamp, "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${message.role === 'user' ? 'bg-blue-100 text-blue-800' : 
                        message.role === 'assistant' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {message.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {message.metadata?.project || "-"}
                  </TableCell>
                  <TableCell>
                    {message.metadata?.owner || "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {message.content}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {message.metadata?.tags?.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs">
                          {tag}
                        </span>
                      )) || "-"}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {filteredMessages.length} of {messages.length} messages
      </div>
    </div>
  );
}
