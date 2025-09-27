import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  StopCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCw, 
  Settings,
  Zap,
  AlertCircle
} from "lucide-react";

const ControlPanel = () => {
  const [selectedTrain, setSelectedTrain] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [controlMode, setControlMode] = useState<"manual" | "auto">("auto");

  const controlActions = [
    { id: "proceed", label: "Proceed", icon: Play, variant: "default" as const },
    { id: "hold", label: "Hold Signal", icon: Pause, variant: "secondary" as const },
    { id: "stop", label: "Emergency Stop", icon: StopCircle, variant: "destructive" as const },
    { id: "divert", label: "Divert Track", icon: RotateCw, variant: "outline" as const },
  ];

  const trainList = [
    { id: "12345", name: "Mumbai Express", status: "approaching" },
    { id: "67890", name: "Local Fast", status: "waiting" },
    { id: "11111", name: "Freight Special", status: "delayed" },
    { id: "22222", name: "Rajdhani Exp", status: "proceeding" },
  ];

  return (
    <Card className="shadow-control">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>Section Control Panel</span>
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant={controlMode === "auto" ? "default" : "outline"}
              size="sm"
              onClick={() => setControlMode("auto")}
              className={controlMode === "auto" ? "bg-gradient-primary" : ""}
            >
              <Zap className="w-3 h-3 mr-1" />
              Auto
            </Button>
            <Button
              variant={controlMode === "manual" ? "default" : "outline"}
              size="sm"
              onClick={() => setControlMode("manual")}
            >
              Manual
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Train Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Train</label>
            <Select value={selectedTrain} onValueChange={setSelectedTrain}>
              <SelectTrigger>
                <SelectValue placeholder="Choose train..." />
              </SelectTrigger>
              <SelectContent>
                {trainList.map((train) => (
                  <SelectItem key={train.id} value={train.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{train.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${
                          train.status === "delayed" ? "border-destructive text-destructive" :
                          train.status === "proceeding" ? "border-success text-success" :
                          "border-warning text-warning"
                        }`}
                      >
                        {train.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTrain && (
              <div className="text-xs text-muted-foreground font-mono">
                Train #{selectedTrain} selected
              </div>
            )}
          </div>

          {/* Track Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Target Track</label>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger>
                <SelectValue placeholder="Select track..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main1">Main Line 1</SelectItem>
                <SelectItem value="main2">Main Line 2</SelectItem>
                <SelectItem value="loop1">Loop Line A</SelectItem>
                <SelectItem value="loop2">Loop Line B</SelectItem>
                <SelectItem value="yard1">Yard Line 1</SelectItem>
                <SelectItem value="outline1">Outline Track</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Control Actions */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Control Actions</label>
            <div className="grid grid-cols-2 gap-2">
              {controlActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant}
                  size="sm"
                  className={`flex items-center justify-center space-x-1 ${
                    action.variant === "default" ? "bg-gradient-primary" : ""
                  }`}
                  disabled={!selectedTrain}
                >
                  <action.icon className="w-3 h-3" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Active Signals: 12</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertCircle className="w-3 h-3 text-warning" />
                <span>Pending: 3</span>
              </div>
            </div>
            
            <div className="text-muted-foreground font-mono">
              Last Update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;