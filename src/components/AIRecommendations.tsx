import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Zap, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";

interface Recommendation {
  id: string;
  type: "optimization" | "safety" | "delay";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
  confidence: number;
  reasoning: string;
  estimatedDelay: number;
  affectedTrains: string[];
}

const mockRecommendations: Recommendation[] = [
  {
    id: "rec1",
    type: "optimization",
    priority: "high",
    title: "Prioritize Mumbai Express on Main Line 1",
    description: "Allow Mumbai Express (#12345) to proceed on Main Line 1 to maintain schedule",
    impact: "Reduces overall delay by 8 minutes, improves throughput by 15%",
    confidence: 92,
    reasoning: "High priority express train with minimal impact on other services. Current clear path available.",
    estimatedDelay: -8,
    affectedTrains: ["12345", "67890"]
  },
  {
    id: "rec2",
    type: "safety",
    priority: "high",
    title: "Hold Local Fast at Signal",
    description: "Temporarily hold Local Fast (#67890) to maintain safe separation",
    impact: "Prevents potential conflict, ensures 2-minute safety margin",
    confidence: 98,
    reasoning: "Freight train ahead moving slower than expected. Safety protocols require minimum separation distance.",
    estimatedDelay: 3,
    affectedTrains: ["67890", "11111"]
  },
  {
    id: "rec3",
    type: "delay",
    priority: "medium",
    title: "Reroute via Loop Line B",
    description: "Divert Freight Special to Loop Line B to clear main line",
    impact: "Reduces congestion, allows express services to maintain priority",
    confidence: 85,
    reasoning: "Loop line currently available. Freight can maintain speed with minimal time impact.",
    estimatedDelay: 2,
    affectedTrains: ["11111", "22222"]
  }
];

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [selectedRec, setSelectedRec] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [showOverrideDialog, setShowOverrideDialog] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "optimization": return TrendingUp;
      case "safety": return ShieldCheck;
      case "delay": return Clock;
      default: return Zap;
    }
  };

  const handleAcceptRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    // Log decision here
  };

  const handleOverride = (id: string) => {
    if (overrideReason.trim()) {
      setRecommendations(prev => prev.filter(rec => rec.id !== id));
      setShowOverrideDialog(null);
      setOverrideReason("");
      // Log override decision with reason
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>AI Recommendations</span>
          </span>
          <Badge variant="outline" className="bg-gradient-primary text-primary-foreground">
            {recommendations.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4 pb-4">
          <div className="space-y-3">
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success" />
                <p>All recommendations processed</p>
                <p className="text-sm">System monitoring for new suggestions...</p>
              </div>
            ) : (
              recommendations.map((rec) => {
                const TypeIcon = getTypeIcon(rec.type);
                
                return (
                  <Card key={rec.id} className={`transition-all duration-200 ${
                    selectedRec === rec.id ? "ring-2 ring-primary" : ""
                  }`}>
                    <CardContent className="p-4 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <TypeIcon className={`w-4 h-4 mt-0.5 ${getPriorityColor(rec.priority)}`} />
                          <div>
                            <h4 className="text-sm font-semibold">{rec.title}</h4>
                            <p className="text-xs text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(rec.priority)}`}
                        >
                          {rec.priority}
                        </Badge>
                      </div>

                      {/* Impact & Confidence */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Impact:</span>
                          <span className={rec.estimatedDelay < 0 ? "text-success" : "text-warning"}>
                            {rec.estimatedDelay > 0 ? "+" : ""}{rec.estimatedDelay}min delay
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="font-mono">{rec.confidence}%</span>
                        </div>
                      </div>

                      {/* Affected Trains */}
                      <div className="flex flex-wrap gap-1">
                        {rec.affectedTrains.map(trainId => (
                          <Badge key={trainId} variant="secondary" className="text-xs">
                            #{trainId}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-primary"
                          onClick={() => handleAcceptRecommendation(rec.id)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Accept
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRec(selectedRec === rec.id ? null : rec.id)}
                        >
                          <HelpCircle className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setShowOverrideDialog(rec.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Expanded Reasoning */}
                      {selectedRec === rec.id && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <h5 className="text-xs font-semibold text-muted-foreground mb-2">AI REASONING:</h5>
                          <p className="text-xs text-foreground">{rec.reasoning}</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <strong>Expected Impact:</strong> {rec.impact}
                          </div>
                        </div>
                      )}

                      {/* Override Dialog */}
                      {showOverrideDialog === rec.id && (
                        <div className="mt-3 pt-3 border-t border-border space-y-2">
                          <h5 className="text-xs font-semibold">Override Reasoning:</h5>
                          <Textarea
                            placeholder="Enter your reasoning for overriding this recommendation..."
                            value={overrideReason}
                            onChange={(e) => setOverrideReason(e.target.value)}
                            className="text-xs"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleOverride(rec.id)}
                              disabled={!overrideReason.trim()}
                            >
                              Override
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setShowOverrideDialog(null);
                                setOverrideReason("");
                              }}
                            >
                              Cancel
                            </Button>
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

export default AIRecommendations;