import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Train, AlertTriangle, Clock } from "lucide-react";

// Track segment definition
interface TrackSegment {
  id: string;
  name: string;
  type: "main" | "loop" | "yard" | "junction";
  start: [number, number, number];
  end: [number, number, number];
  status: "vacant" | "occupied" | "decision" | "yard";
  trainId?: string;
}

// Train data with position tracking
interface TrainData {
  id: string;
  name: string;
  type: "express" | "local" | "freight";
  position: [number, number, number];
  speed: number;
  delay: number;
  priority: "high" | "normal" | "low";
  trackSegmentId: string;
}

// Mock complex railway network data
const trackSegments: TrackSegment[] = [
  // Main Line 1 - Horizontal backbone
  { id: "M1-1", name: "Main 1 Seg 1", type: "main", start: [-15, 3, 0], end: [-5, 3, 0], status: "occupied", trainId: "12345" },
  { id: "M1-2", name: "Main 1 Seg 2", type: "main", start: [-5, 3, 0], end: [5, 3, 0], status: "vacant" },
  { id: "M1-3", name: "Main 1 Seg 3", type: "main", start: [5, 3, 0], end: [15, 3, 0], status: "decision" },
  
  // Main Line 2 - Parallel to Main 1
  { id: "M2-1", name: "Main 2 Seg 1", type: "main", start: [-15, 1, 0], end: [-5, 1, 0], status: "vacant" },
  { id: "M2-2", name: "Main 2 Seg 2", type: "main", start: [-5, 1, 0], end: [5, 1, 0], status: "occupied", trainId: "22222" },
  { id: "M2-3", name: "Main 2 Seg 3", type: "main", start: [5, 1, 0], end: [15, 1, 0], status: "vacant" },
  
  // Main Line 3 - Lower main line
  { id: "M3-1", name: "Main 3 Seg 1", type: "main", start: [-15, -1, 0], end: [-5, -1, 0], status: "occupied", trainId: "67890" },
  { id: "M3-2", name: "Main 3 Seg 2", type: "main", start: [-5, -1, 0], end: [5, -1, 0], status: "vacant" },
  { id: "M3-3", name: "Main 3 Seg 3", type: "main", start: [5, -1, 0], end: [15, -1, 0], status: "vacant" },
  
  // Loop Lines - Connecting curves
  { id: "L1-1", name: "Loop 1A", type: "loop", start: [-5, 3, 0], end: [-3, 5, 0], status: "vacant" },
  { id: "L1-2", name: "Loop 1B", type: "loop", start: [-3, 5, 0], end: [3, 5, 0], status: "vacant" },
  { id: "L1-3", name: "Loop 1C", type: "loop", start: [3, 5, 0], end: [5, 3, 0], status: "vacant" },
  
  { id: "L2-1", name: "Loop 2A", type: "loop", start: [-5, 1, 0], end: [-3, -3, 0], status: "vacant" },
  { id: "L2-2", name: "Loop 2B", type: "loop", start: [-3, -3, 0], end: [3, -3, 0], status: "occupied", trainId: "33333" },
  { id: "L2-3", name: "Loop 2C", type: "loop", start: [3, -3, 0], end: [5, -1, 0], status: "vacant" },
  
  // Yard Lines - Storage tracks
  { id: "Y1-1", name: "Yard 1", type: "yard", start: [-12, 6, 0], end: [-8, 6, 0], status: "yard" },
  { id: "Y1-2", name: "Yard 2", type: "yard", start: [-12, 7, 0], end: [-8, 7, 0], status: "yard" },
  { id: "Y1-3", name: "Yard 3", type: "yard", start: [-12, 8, 0], end: [-8, 8, 0], status: "yard" },
  
  { id: "Y2-1", name: "Yard 4", type: "yard", start: [8, -5, 0], end: [12, -5, 0], status: "yard" },
  { id: "Y2-2", name: "Yard 5", type: "yard", start: [8, -6, 0], end: [12, -6, 0], status: "yard" },
  { id: "Y2-3", name: "Yard 6", type: "yard", start: [8, -7, 0], end: [12, -7, 0], status: "yard" },
  
  // Junction connectors
  { id: "J1-1", name: "Junction 1A", type: "junction", start: [-5, 3, 0], end: [-5, 1, 0], status: "vacant" },
  { id: "J1-2", name: "Junction 1B", type: "junction", start: [-5, 1, 0], end: [-5, -1, 0], status: "vacant" },
  { id: "J2-1", name: "Junction 2A", type: "junction", start: [5, 3, 0], end: [5, 1, 0], status: "vacant" },
  { id: "J2-2", name: "Junction 2B", type: "junction", start: [5, 1, 0], end: [5, -1, 0], status: "vacant" },
  
  // Yard connectors
  { id: "YC1-1", name: "Yard Conn 1", type: "junction", start: [-8, 6, 0], end: [-5, 3, 0], status: "vacant" },
  { id: "YC2-1", name: "Yard Conn 2", type: "junction", start: [8, -5, 0], end: [5, -1, 0], status: "vacant" },
];

const mockTrains: TrainData[] = [
  { id: "12345", name: "Mumbai Express", type: "express", position: [-10, 3, 0], speed: 85, delay: 0, priority: "high", trackSegmentId: "M1-1" },
  { id: "22222", name: "Rajdhani Exp", type: "express", position: [0, 1, 0], speed: 90, delay: 0, priority: "high", trackSegmentId: "M2-2" },
  { id: "67890", name: "Local Fast", type: "local", position: [-10, -1, 0], speed: 60, delay: 5, priority: "normal", trackSegmentId: "M3-1" },
  { id: "33333", name: "Suburban Local", type: "local", position: [0, -3, 0], speed: 55, delay: 8, priority: "normal", trackSegmentId: "L2-2" },
];

// Track segment renderer
const TrackSegment = ({ segment }: { segment: TrackSegment }) => {
  const ref = useRef<THREE.Line>();
  
  const getColor = (status: string) => {
    switch (status) {
      case "occupied": return "#ff4444"; // Red
      case "vacant": return "#44ff44"; // Green
      case "decision": return "#ffffff"; // White
      case "yard": return "#444444"; // Black/Dark gray
      default: return "#888888";
    }
  };
  
  const points = [new THREE.Vector3(...segment.start), new THREE.Vector3(...segment.end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <primitive 
      ref={ref}
      object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
        color: getColor(segment.status),
        linewidth: 2
      }))}
    />
  );
};

// Signal renderer
const Signal = ({ position, status }: { position: [number, number, number]; status: string }) => {
  const getSignalColor = (status: string) => {
    switch (status) {
      case "clear": return "#00ff00";
      case "caution": return "#ffaa00";
      case "danger": return "#ff0000";
      default: return "#888888";
    }
  };
  
  return (
    <mesh position={position}>
      <circleGeometry args={[0.1, 8]} />
      <meshBasicMaterial color={getSignalColor(status)} />
    </mesh>
  );
};

// Train renderer
const TrainMarker = ({ train }: { train: TrainData }) => {
  const ref = useRef<THREE.Mesh>();
  
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += 0.01;
    }
  });
  
  const getTrainColor = (type: string) => {
    switch (type) {
      case "express": return "#0066ff";
      case "local": return "#ff6600";
      case "freight": return "#888888";
      default: return "#ffffff";
    }
  };
  
  return (
    <group position={train.position}>
      <mesh ref={ref}>
        <boxGeometry args={[0.3, 0.15, 0.1]} />
        <meshBasicMaterial color={getTrainColor(train.type)} />
      </mesh>
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {train.id}
      </Text>
    </group>
  );
};

// Junction switch renderer
const JunctionSwitch = ({ position }: { position: [number, number, number] }) => {
  return (
    <mesh position={position}>
      <circleGeometry args={[0.15, 6]} />
      <meshBasicMaterial color="#ffff00" />
    </mesh>
  );
};

// Main 3D scene
const RailwayScene = ({ onTrainClick }: { onTrainClick: (train: TrainData) => void }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 25);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Grid background */}
      <gridHelper args={[40, 40, "#333333", "#222222"]} rotation={[Math.PI / 2, 0, 0]} />
      
      {/* Track segments */}
      {trackSegments.map(segment => (
        <TrackSegment key={segment.id} segment={segment} />
      ))}
      
      {/* Trains */}
      {mockTrains.map(train => (
        <group
          key={train.id}
          onClick={() => onTrainClick(train)}
          onPointerOver={(e) => (e.object.userData.hovered = true)}
          onPointerOut={(e) => (e.object.userData.hovered = false)}
        >
          <TrainMarker train={train} />
        </group>
      ))}
      
      {/* Junction switches */}
      <JunctionSwitch position={[-5, 2, 0]} />
      <JunctionSwitch position={[-5, 0, 0]} />
      <JunctionSwitch position={[5, 2, 0]} />
      <JunctionSwitch position={[5, 0, 0]} />
      
      {/* Signals */}
      <Signal position={[-15, 3.5, 0]} status="clear" />
      <Signal position={[-10, 3.5, 0]} status="danger" />
      <Signal position={[0, 3.5, 0]} status="caution" />
      <Signal position={[10, 3.5, 0]} status="clear" />
      <Signal position={[15, 3.5, 0]} status="clear" />
      
      {/* Station labels */}
      <Text position={[-15, 4, 0]} fontSize={0.3} color="cyan">Mumbai Central</Text>
      <Text position={[0, 6, 0]} fontSize={0.3} color="cyan">Dadar Junction</Text>
      <Text position={[15, 4, 0]} fontSize={0.3} color="cyan">Andheri</Text>
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={50}
        minDistance={10}
      />
    </>
  );
};

const RealisticRailwayNetwork = () => {
  const [selectedTrain, setSelectedTrain] = useState<TrainData | null>(null);
  
  const handleTrainClick = (train: TrainData) => {
    setSelectedTrain(selectedTrain?.id === train.id ? null : train);
  };
  
  return (
    <div className="relative h-full bg-gray-900 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 25], fov: 60 }}
        style={{ background: "#111111" }}
      >
        <RailwayScene onTrainClick={handleTrainClick} />
      </Canvas>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-4 h-1 bg-green-500"></div>
          <span className="text-green-400">Vacant</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-4 h-1 bg-red-500"></div>
          <span className="text-red-400">Occupied</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-4 h-1 bg-white"></div>
          <span className="text-white">Decision Change</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-4 h-1 bg-gray-600"></div>
          <span className="text-gray-400">Yard Lines</span>
        </div>
      </div>
      
      {/* Network Status */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            <div className="w-2 h-2 bg-signal-clear rounded-full mr-2 animate-pulse" />
            Network Active
          </Badge>
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {mockTrains.length} Active Trains
          </Badge>
        </div>
      </div>
      
      {/* Train Details Panel */}
      {selectedTrain && (
        <Card className="absolute bottom-4 right-4 w-72 shadow-control bg-gray-800/90 backdrop-blur-sm border-gray-600">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{selectedTrain.name}</h3>
              <Badge 
                variant={selectedTrain.priority === "high" ? "default" : "secondary"}
                className={selectedTrain.priority === "high" ? "bg-gradient-primary" : ""}
              >
                {selectedTrain.priority}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Train No.</div>
                <div className="font-mono text-white">{selectedTrain.id}</div>
              </div>
              <div>
                <div className="text-gray-400">Speed</div>
                <div className="font-mono text-white">{selectedTrain.speed} km/h</div>
              </div>
              <div>
                <div className="text-gray-400">Type</div>
                <div className="capitalize text-white">{selectedTrain.type}</div>
              </div>
              <div>
                <div className="text-gray-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Delay</span>
                </div>
                <div className={`font-mono ${selectedTrain.delay > 0 ? "text-red-400" : "text-green-400"}`}>
                  {selectedTrain.delay > 0 ? `+${selectedTrain.delay}` : "0"} min
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
        </Card>
      )}
      
      {/* Controls Help */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 space-y-1">
        <div>Mouse: Rotate view</div>
        <div>Scroll: Zoom in/out</div>
        <div>Click trains for details</div>
      </div>
    </div>
  );
};

export default RealisticRailwayNetwork;