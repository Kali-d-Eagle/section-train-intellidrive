import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Train, 
  Activity, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  HelpCircle,
  ShieldCheck
} from "lucide-react";
import RealisticRailwayNetwork from "@/components/RealisticRailwayNetwork";
import ControlPanel from "@/components/ControlPanel";
import AIRecommendations from "@/components/AIRecommendations";
import KPIMetrics from "@/components/KPIMetrics";
import DecisionLog from "@/components/DecisionLog";
import SandboxEnvironment from "@/components/SandboxEnvironment";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Train className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">RailOps</h1>
              <Badge variant="outline" className="text-accent">Control Center</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-signal-clear rounded-full animate-pulse"></div>
                <span>System Active</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Live Mode
            </Button>
            
            <Button size="sm" className="bg-gradient-primary">
              <Zap className="w-4 h-4 mr-2" />
              AI Assist
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-81px)]">
        {/* Main Network Display */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <Card className="h-full shadow-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Train className="w-5 h-5 text-primary" />
                    <span>Section Network Display</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Mumbai Central - Andheri</Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pause className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-4rem)]">
                <RealisticRailwayNetwork />
              </CardContent>
            </Card>
          </div>
          
          {/* Control Panel */}
          <div className="p-4 pt-0">
            <ControlPanel />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 border-l border-border flex flex-col">
          <Tabs defaultValue="ai" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-4 m-2 mb-0">
              <TabsTrigger value="ai" className="text-xs">AI</TabsTrigger>
              <TabsTrigger value="kpi" className="text-xs">KPI</TabsTrigger>
              <TabsTrigger value="log" className="text-xs">Log</TabsTrigger>
              <TabsTrigger value="sandbox" className="text-xs">Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="flex-1 m-2 mt-0">
              <AIRecommendations />
            </TabsContent>
            
            <TabsContent value="kpi" className="flex-1 m-2 mt-0">
              <KPIMetrics />
            </TabsContent>
            
            <TabsContent value="log" className="flex-1 m-2 mt-0">
              <DecisionLog />
            </TabsContent>
            
            <TabsContent value="sandbox" className="flex-1 m-2 mt-0">
              <SandboxEnvironment />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;