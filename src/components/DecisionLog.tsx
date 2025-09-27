import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  History, 
  User, 
  Bot, 
  Clock, 
  CheckCircle, 
  X, 
  AlertTriangle,
  Filter,
  Download
} from "lucide-react";

interface DecisionLogEntry {
  id: string;
  timestamp: Date;
  type: "accept" | "override" | "emergency";
  source: "ai" | "controller";
  trainId: string;
  trainName: string;
  action: string;
  reasoning: string;
  impact: string;
  controllerName?: string;
  outcome?: "success" | "pending" | "failed";
}

const mockLogEntries: DecisionLogEntry[] = [
  {
    id: "log1",
    timestamp: new Date(Date.now() - 300000),
    type: "accept",
    source: "ai",
    trainId: "12345",
    trainName: "Mumbai Express",
    action: "Proceed on Main Line 1",
    reasoning: "High priority express train with clear path. Optimal for throughput.",
    impact: "Reduced section delay by 8 minutes",
    outcome: "success"
  },
  {
    id: "log2",
    timestamp: new Date(Date.now() - 600000),
    type: "override",
    source: "controller",
    trainId: "67890",
    trainName: "Local Fast",
    action: "Hold at Signal Point 2",
    reasoning: "Controller noted passenger boarding delay at previous station",
    impact: "Prevented cascade delay, maintained safety margin",
    controllerName: "S. Kumar",
    outcome: "success"
  },
  {
    id: "log3",
    timestamp: new Date(Date.now() - 900000),
    type: "emergency",
    source: "controller",
    trainId: "11111",
    trainName: "Freight Special",
    action: "Emergency Stop - Signal Failure",
    reasoning: "Signal malfunction detected on approach track",
    impact: "Prevented potential safety incident",
    controllerName: "S. Kumar",
    outcome: "success"
  },
  {
    id: "log4",
    timestamp: new Date(Date.now() - 1200000),
    type: "accept",
    source: "ai",
    trainId: "22222",
    trainName: "Rajdhani Express",
    action: "Divert to Loop Line B",
    reasoning: "Optimization for express priority while clearing main line",
    impact: "Improved overall section throughput by 12%",
    outcome: "success"
  },
  {
    id: "log5",
    timestamp: new Date(Date.now() - 1500000),
    type: "override",
    source: "controller",
    trainId: "33333",
    trainName: "Suburban Local",
    action: "Priority Override - Medical Emergency",
    reasoning: "Medical emergency reported onboard, priority clearance needed",
    impact: "Enabled emergency medical response",
    controllerName: "S. Kumar",
    outcome: "success"
  }
];

const DecisionLog = () => {
  const [logEntries, setLogEntries] = useState<DecisionLogEntry[]>(mockLogEntries);
  const [filter, setFilter] = useState<string>("all");
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const filteredEntries = logEntries.filter(entry => {
    if (filter === "all") return true;
    return entry.type === filter || entry.source === filter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "accept": return CheckCircle;
      case "override": return User;
      case "emergency": return AlertTriangle;
      default: return Clock;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "accept": return "text-success border-success";
      case "override": return "text-warning border-warning";
      case "emergency": return "text-destructive border-destructive";
      default: return "text-muted-foreground border-muted";
    }
  };

  const getSourceIcon = (source: string) => {
    return source === "ai" ? Bot : User;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = Date.now();
    const diff = now - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary" />
            <span>Decision Log</span>
          </span>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
        </CardTitle>
        
        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="accept">AI Accepted</SelectItem>
              <SelectItem value="override">Overrides</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="ai">AI Decisions</SelectItem>
              <SelectItem value="controller">Controller</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant="outline" className="text-xs">
            {filteredEntries.length} entries
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4 pb-4">
          <div className="space-y-2">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No entries match current filter</p>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const TypeIcon = getTypeIcon(entry.type);
                const SourceIcon = getSourceIcon(entry.source);
                const isExpanded = expandedEntry === entry.id;
                
                return (
                  <Card 
                    key={entry.id} 
                    className={`cursor-pointer transition-all duration-200 border-l-4 ${getTypeColor(entry.type)} ${
                      isExpanded ? "shadow-control" : ""
                    }`}
                    onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                  >
                    <CardContent className="p-3 space-y-2">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className={`w-3 h-3 ${getTypeColor(entry.type).split(' ')[0]}`} />
                          <SourceIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{entry.action}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(entry.timestamp)}</span>
                        </div>
                      </div>

                      {/* Train Info */}
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          #{entry.trainId}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{entry.trainName}</span>
                      </div>

                      {/* Basic Info */}
                      <div className="text-xs text-muted-foreground">
                        {entry.reasoning.slice(0, 80)}
                        {entry.reasoning.length > 80 && !isExpanded && "..."}
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-border space-y-2 text-xs">
                          <div>
                            <span className="font-semibold text-muted-foreground">Full Reasoning:</span>
                            <p className="text-foreground mt-1">{entry.reasoning}</p>
                          </div>
                          
                          <div>
                            <span className="font-semibold text-muted-foreground">Impact:</span>
                            <p className="text-foreground mt-1">{entry.impact}</p>
                          </div>
                          
                          {entry.controllerName && (
                            <div>
                              <span className="font-semibold text-muted-foreground">Controller:</span>
                              <p className="text-foreground mt-1">{entry.controllerName}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-muted-foreground">Timestamp:</span>
                              <p className="text-foreground mt-1 font-mono">
                                {entry.timestamp.toLocaleString()}
                              </p>
                            </div>
                            
                            {entry.outcome && (
                              <Badge 
                                variant="outline" 
                                className={`${
                                  entry.outcome === "success" ? "text-success border-success" :
                                  entry.outcome === "failed" ? "text-destructive border-destructive" :
                                  "text-warning border-warning"
                                }`}
                              >
                                {entry.outcome}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DecisionLog;