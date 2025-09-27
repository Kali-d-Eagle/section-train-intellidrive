import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Beaker, 
  Play, 
  RotateCcw, 
  Settings, 
  Save, 
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  description: string;
  constraints: string[];
  trains: number;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
}

interface TestResult {
  id: string;
  scenario: string;
  aiDecisions: number;
  overrides: number;
  avgDelay: number;
  throughput: number;
  safetyScore: number;
  timestamp: Date;
}

const predefinedScenarios: Scenario[] = [
  {
    id: "rush_hour",
    name: "Morning Rush Hour",
    description: "High volume traffic with mixed train types during peak hours",
    constraints: ["Platform capacity limited", "Freight must avoid peak slots", "Express priority maintained"],
    trains: 15,
    duration: "2 hours",
    difficulty: "medium"
  },
  {
    id: "signal_failure",
    name: "Signal System Failure",
    description: "Primary signaling system down, manual control required",
    constraints: ["Reduced speed limits", "Manual authorization needed", "Emergency protocols active"],
    trains: 8,
    duration: "45 minutes",
    difficulty: "hard"
  },
  {
    id: "weather_delay",
    name: "Monsoon Operations",
    description: "Heavy rain causing speed restrictions and visibility issues",
    constraints: ["Speed limits reduced by 40%", "Extended safety margins", "Platform flooding risk"],
    trains: 12,
    duration: "3 hours",
    difficulty: "medium"
  },
  {
    id: "maintenance",
    name: "Track Maintenance Window",
    description: "Scheduled maintenance with single line operation",
    constraints: ["Only one main line available", "Maintenance block 2-4 PM", "Freight priority during window"],
    trains: 6,
    duration: "4 hours",
    difficulty: "easy"
  }
];

const mockTestResults: TestResult[] = [
  {
    id: "test1",
    scenario: "Morning Rush Hour",
    aiDecisions: 23,
    overrides: 3,
    avgDelay: 2.8,
    throughput: 92,
    safetyScore: 98,
    timestamp: new Date(Date.now() - 86400000)
  },
  {
    id: "test2", 
    scenario: "Signal System Failure",
    aiDecisions: 15,
    overrides: 8,
    avgDelay: 12.4,
    throughput: 45,
    safetyScore: 95,
    timestamp: new Date(Date.now() - 172800000)
  }
];

const SandboxEnvironment = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [customConstraints, setCustomConstraints] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>(mockTestResults);
  const [activeTab, setActiveTab] = useState("scenarios");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-success border-success";
      case "medium": return "text-warning border-warning";
      case "hard": return "text-destructive border-destructive";
      default: return "text-muted-foreground border-muted";
    }
  };

  const runScenario = () => {
    if (!selectedScenario) return;
    
    setIsRunning(true);
    
    // Simulate test run
    setTimeout(() => {
      const scenario = predefinedScenarios.find(s => s.id === selectedScenario);
      if (scenario) {
        const newResult: TestResult = {
          id: Date.now().toString(),
          scenario: scenario.name,
          aiDecisions: Math.floor(Math.random() * 30) + 10,
          overrides: Math.floor(Math.random() * 8),
          avgDelay: Math.random() * 15,
          throughput: Math.floor(Math.random() * 40) + 60,
          safetyScore: Math.floor(Math.random() * 10) + 90,
          timestamp: new Date()
        };
        
        setTestResults(prev => [newResult, ...prev]);
      }
      setIsRunning(false);
    }, 3000);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Beaker className="w-5 h-5 text-primary" />
            <span>Sandbox</span>
          </span>
          <Badge variant="outline" className="bg-gradient-primary text-primary-foreground">
            Testing Mode
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-4">
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scenarios" className="flex-1 px-4 pb-4 space-y-4">
            {/* Scenario Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Test Scenario</label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose scenario..." />
                </SelectTrigger>
                <SelectContent>
                  {predefinedScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{scenario.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`ml-2 ${getDifficultyColor(scenario.difficulty)}`}
                        >
                          {scenario.difficulty}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scenario Details */}
            {selectedScenario && (
              <Card className="bg-muted/50">
                <CardContent className="p-3 space-y-3">
                  {(() => {
                    const scenario = predefinedScenarios.find(s => s.id === selectedScenario);
                    if (!scenario) return null;
                    
                    return (
                      <>
                        <div>
                          <h4 className="text-sm font-semibold">{scenario.name}</h4>
                          <p className="text-xs text-muted-foreground">{scenario.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Trains:</span>
                            <div className="font-mono">{scenario.trains}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <div className="font-mono">{scenario.duration}</div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs text-muted-foreground">Constraints:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {scenario.constraints.map((constraint, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {constraint}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Custom Constraints */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Constraints</label>
              <Textarea
                placeholder="Add custom constraints or modifications to the scenario..."
                value={customConstraints}
                onChange={(e) => setCustomConstraints(e.target.value)}
                className="text-xs"
                rows={3}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button
                className="flex-1 bg-gradient-primary"
                onClick={runScenario}
                disabled={!selectedScenario || isRunning}
              >
                {isRunning ? (
                  <>
                    <Clock className="w-3 h-3 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-2" />
                    Run Test
                  </>
                )}
              </Button>
              
              <Button variant="outline" size="sm">
                <Save className="w-3 h-3" />
              </Button>
              
              <Button variant="outline" size="sm">
                <Upload className="w-3 h-3" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="flex-1 px-4 pb-4 space-y-3">
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Beaker className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No test results yet</p>
                <p className="text-xs">Run a scenario to see results here</p>
              </div>
            ) : (
              testResults.map((result) => (
                <Card key={result.id}>
                  <CardContent className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">{result.scenario}</h4>
                      <div className="text-xs text-muted-foreground">
                        {result.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-muted-foreground">AI Decisions</div>
                        <div className="font-mono text-success">{result.aiDecisions}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Overrides</div>
                        <div className="font-mono text-warning">{result.overrides}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Delay</div>
                        <div className="font-mono">{result.avgDelay.toFixed(1)}min</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Throughput</div>
                        <div className="font-mono">{result.throughput}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-success" />
                        <span className="text-xs">Safety Score: {result.safetyScore}%</span>
                      </div>
                      
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SandboxEnvironment;