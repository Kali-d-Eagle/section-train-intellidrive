import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  Activity, 
  Train, 
  AlertTriangle, 
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface KPIData {
  label: string;
  value: number | string;
  unit?: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  status: "good" | "warning" | "critical";
  target?: number;
  icon: any;
}

const kpiData: KPIData[] = [
  {
    label: "Section Throughput",
    value: 156,
    unit: "trains/hour",
    trend: "up",
    trendValue: 12,
    status: "good",
    target: 180,
    icon: TrendingUp
  },
  {
    label: "Average Delay",
    value: 4.2,
    unit: "minutes",
    trend: "down",
    trendValue: -8,
    status: "good",
    target: 3,
    icon: Clock
  },
  {
    label: "Network Utilization",
    value: 78,
    unit: "%",
    trend: "up",
    trendValue: 5,
    status: "warning",
    target: 85,
    icon: Activity
  },
  {
    label: "On-Time Performance",
    value: 92.5,
    unit: "%",
    trend: "stable",
    trendValue: 0,
    status: "good",
    target: 95,
    icon: CheckCircle
  },
  {
    label: "Active Trains",
    value: 23,
    unit: "units",
    trend: "up",
    trendValue: 3,
    status: "good",
    icon: Train
  },
  {
    label: "Safety Incidents",
    value: 0,
    unit: "today",
    trend: "stable",
    trendValue: 0,
    status: "good",
    icon: AlertTriangle
  }
];

const detailedMetrics = [
  { category: "Express Trains", onTime: 94, delayed: 6, total: 8 },
  { category: "Local Trains", onTime: 91, delayed: 9, total: 12 },
  { category: "Freight", onTime: 88, delayed: 12, total: 3 }
];

const KPIMetrics = () => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return ArrowUp;
      case "down": return ArrowDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string, status: string) => {
    if (status === "critical") return "text-destructive";
    
    switch (trend) {
      case "up": return status === "warning" ? "text-warning" : "text-success";
      case "down": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "border-success";
      case "warning": return "border-warning";
      case "critical": return "border-destructive";
      default: return "border-muted";
    }
  };

  return (
    <div className="h-full space-y-4">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {kpiData.map((metric, index) => {
          const TrendIcon = getTrendIcon(metric.trend);
          const IconComponent = metric.icon;
          
          return (
            <Card key={index} className={`${getStatusColor(metric.status)} border-l-4`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="w-4 h-4 text-muted-foreground" />
                  {metric.trend !== "stable" && (
                    <div className={`flex items-center text-xs ${getTrendColor(metric.trend, metric.status)}`}>
                      <TrendIcon className="w-3 h-3 mr-1" />
                      <span>{Math.abs(metric.trendValue)}%</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold">{metric.value}</span>
                    {metric.unit && (
                      <span className="text-xs text-muted-foreground">{metric.unit}</span>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-tight">
                    {metric.label}
                  </p>
                  
                  {metric.target && typeof metric.value === "number" && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(metric.value / metric.target) * 100} 
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Performance Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Performance by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {detailedMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.category}</span>
                <Badge variant="outline" className="text-xs">
                  {metric.total} trains
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>On Time</span>
                  <span>{metric.onTime}%</span>
                </div>
                <Progress value={metric.onTime} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Real-time Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm">Network Operational</span>
            </div>
            <Badge variant="outline" className="text-success border-success">
              Normal
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm">AI System Active</span>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              Learning
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm">Weather Alert</span>
            </div>
            <Badge variant="outline" className="text-warning border-warning">
              Light Rain
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="text-xs text-muted-foreground font-mono">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default KPIMetrics;