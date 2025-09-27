import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Train, AlertTriangle, Clock } from "lucide-react";

// Mock train data
const mockTrains = [
  { id: "12345", name: "Mumbai Express", type: "express", position: 15, speed: 85, delay: 0, priority: "high" },
  { id: "67890", name: "Local Fast", type: "local", position: 45, speed: 60, delay: 5, priority: "normal" },
  { id: "11111", name: "Freight Special", type: "freight", position: 75, speed: 40, delay: 12, priority: "low" },
  { id: "22222", name: "Rajdhani Exp", type: "express", position: 30, speed: 90, delay: 0, priority: "high" },
  { id: "33333", name: "Suburban Local", type: "local", position: 60, speed: 55, delay: 8, priority: "normal" },
];

const trackSections = [
  { id: "main1", name: "Main Line 1", type: "main", color: "track-main" },
  { id: "main2", name: "Main Line 2", type: "main", color: "track-main" },
  { id: "loop1", name: "Loop Line A", type: "loop", color: "track-loop" },
  { id: "loop2", name: "Loop Line B", type: "loop", color: "track-loop" },
  { id: "yard1", name: "Yard Line 1", type: "yard", color: "track-yard" },
  { id: "yard2", name: "Yard Line 2", type: "yard", color: "track-yard" },
  { id: "outline1", name: "Outline Track", type: "outline", color: "track-outline" },
];

const RailwayNetwork = () => {
  const [trains, setTrains] = useState(mockTrains);
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);

  // Simulate train movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prevTrains =>
        prevTrains.map(train => ({
          ...train,
          position: (train.position + train.speed / 100) % 100,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTrainColor = (type: string) => {
    switch (type) {
      case "express": return "train-express";
      case "local": return "train-local";
      case "freight": return "train-freight";
      default: return "train-special";
    }
  };

  const getTrainIcon = (train: any) => (
    <div
      key={train.id}
      className={`absolute flex items-center justify-center w-8 h-6 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 ${
        selectedTrain === train.id ? "ring-2 ring-accent" : ""
      }`}
      style={{ 
        left: `${train.position}%`, 
        backgroundColor: `hsl(var(--${getTrainColor(train.type)}))`,
        transform: "translateX(-50%)"
      }}
      onClick={() => setSelectedTrain(selectedTrain === train.id ? null : train.id)}
    >
      <Train className="w-4 h-4 text-white" />
    </div>
  );

  return (
    <div className="relative h-full bg-gradient-to-br from-muted/20 to-muted/5 overflow-hidden">
      {/* Network Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full gap-1">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-primary/20 rounded-sm" />
          ))}
        </div>
      </div>

      {/* Track Layout */}
      <div className="relative h-full p-8 space-y-12">
        {trackSections.map((track, index) => (
          <div key={track.id} className="relative">
            {/* Track Line */}
            <div 
              className={`h-3 rounded-full relative shadow-sm`}
              style={{ backgroundColor: `hsl(var(--${track.color}))` }}
            >
              {/* Track Segments */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r border-black/20 last:border-r-0" />
                ))}
              </div>
              
              {/* Signals */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 rounded-full bg-signal-clear border-2 border-background" />
              </div>
              <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 rounded-full bg-signal-caution border-2 border-background" />
              </div>
            </div>

            {/* Track Label */}
            <div className="absolute -left-32 top-0 flex items-center">
              <Badge variant="outline" className="text-xs font-mono">
                {track.name}
              </Badge>
            </div>

            {/* Trains on this track */}
            {trains
              .filter((_, i) => i % trackSections.length === index)
              .map(train => getTrainIcon(train))}
          </div>
        ))}

        {/* Junction Points */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {/* Connection lines between tracks */}
          <path
            d="M 200 80 Q 250 120 300 160"
            stroke="hsl(var(--track-main))"
            strokeWidth="3"
            fill="none"
            className="opacity-60"
          />
          <path
            d="M 400 200 Q 450 240 500 280"
            stroke="hsl(var(--track-loop))"
            strokeWidth="3"
            fill="none"
            className="opacity-60"
          />
        </svg>
      </div>

      {/* Train Information Panel */}
      {selectedTrain && (
        <Card className="absolute bottom-4 right-4 w-72 shadow-control">
          {(() => {
            const train = trains.find(t => t.id === selectedTrain);
            if (!train) return null;
            
            return (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{train.name}</h3>
                  <Badge 
                    variant={train.priority === "high" ? "default" : "secondary"}
                    className={train.priority === "high" ? "bg-gradient-primary" : ""}
                  >
                    {train.priority}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Train No.</div>
                    <div className="font-mono">{train.id}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Speed</div>
                    <div className="font-mono">{train.speed} km/h</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Type</div>
                    <div className="capitalize">{train.type}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Delay</span>
                    </div>
                    <div className={`font-mono ${train.delay > 0 ? "text-destructive" : "text-success"}`}>
                      {train.delay > 0 ? `+${train.delay}` : "0"} min
                    </div>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedTrain(null)}
                >
                  Close Details
                </Button>
              </div>
            );
          })()}
        </Card>
      )}

      {/* Network Status */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            <div className="w-2 h-2 bg-signal-clear rounded-full mr-2 animate-pulse" />
            Network Active
          </Badge>
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {trains.length} Trains
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default RailwayNetwork;