"use client"

import { useEffect, useState, useCallback, useRef, memo } from "react"
import { AlertCircle, Check, Download, Power, Settings, ThermometerIcon, RotateCcw, Play } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RoboticArm, BoxGirderSegment } from "../components/robotic-arm"
import { EnvironmentalGauge } from "../components/environmental-gauge"
import { LineChart } from "../components/line-chart"
import { AlertHistory } from "../components/alert-history"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  ArrowUpDown, 
  Info, 
  AlertTriangle, 
  Wind,
  Clock,
  PlusCircle,
  MinusCircle,
  Eraser,
  FlaskConical,
  X,
} from "lucide-react"

// Optimized memoized components for better performance
const ProjectInfoCard = memo(function ProjectInfoCard({ 
  projectId,
  temperature,
  humidity,
  time 
}: { 
  projectId: string;
  temperature: number;
  humidity: number;
  time: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Project Information
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Current project and environmental data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Project ID:</span>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{projectId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-1">
              <ThermometerIcon className="h-4 w-4" /> Temperature:
            </span>
            <span className="text-sm font-semibold">
              {temperature}°C
              {temperature > 28 && (
                <Badge variant="destructive" className="ml-2">High</Badge>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-1">
              <Wind className="h-4 w-4" /> Humidity:
            </span>
            <span className="text-sm font-semibold">{humidity}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-1">
              <Clock className="h-4 w-4" /> Time:
            </span>
            <span className="text-sm font-semibold">{time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Status log with better animations
const StatusLogCard = memo(function StatusLogCard({ logs }: { logs: string[] }) {
  const logEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when logs update
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Status Log</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[120px] px-4">
          {logs.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              No activity to display
            </div>
          ) : (
            <div className="space-y-2 pt-2 pb-4">
              {logs.map((log, index) => (
                <div key={index} className="text-sm border-l-2 pl-2 border-primary-foreground/20">
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

// Gluing area selection with better visualization
const GluingAreaCard = memo(function GluingAreaCard({ 
  selectedSegments, 
  onClearSelections 
}: { 
  selectedSegments: BoxGirderSegment[];
  onClearSelections: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Gluing Area Selection</span>
          {selectedSegments.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={onClearSelections}
            >
              <Eraser className="h-3 w-3 mr-1" />
              Clear All Selections
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedSegments.length === 0 ? (
          <div className="py-2 text-center text-muted-foreground">
            Select segments on the 3D model
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSegments.map((segment) => (
              <Badge 
                key={segment.id} 
                variant={segment.aiSuggested ? "outline" : "default"}
                className={`${segment.aiSuggested ? "border-green-500 text-green-500" : ""}`}
              >
                {segment.id}
                {segment.aiSuggested && <Check className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// Glue thickness control with better UI
const GlueThicknessCard = memo(function GlueThicknessCard({ 
  suggestedThickness,
  confirmedThickness,
  isApplyingGlue,
  onChangeThickness,
  onApplyGlue
}: { 
  suggestedThickness: number;
  confirmedThickness: number;
  isApplyingGlue: boolean;
  onChangeThickness: (value: number) => void;
  onApplyGlue: () => void;
}) {
  // Handle increment/decrement with fixed bounds
  const incrementThickness = () => {
    if (confirmedThickness < 10) {
      onChangeThickness(confirmedThickness + 0.5);
    }
  };
  
  const decrementThickness = () => {
    if (confirmedThickness > 0.5) {
      onChangeThickness(confirmedThickness - 0.5);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Glue Thickness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">AI Suggestion:</span>
            <Badge variant="outline" className="font-mono border-green-500 text-green-500">
              {suggestedThickness.toFixed(1)} mm
              <Check className="ml-1 h-3 w-3" />
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="thickness" className="text-sm">Operator Value:</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={decrementThickness}
                  disabled={confirmedThickness <= 0.5 || isApplyingGlue}
                >
                  <MinusCircle className="h-3 w-3" />
                </Button>
                <span className="font-mono w-12 text-center">{confirmedThickness.toFixed(1)} mm</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={incrementThickness}
                  disabled={confirmedThickness >= 10 || isApplyingGlue}
                >
                  <PlusCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Slider
              id="thickness"
              min={0.5}
              max={10}
              step={0.5}
              value={[confirmedThickness]}
              onValueChange={(value) => onChangeThickness(value[0])}
              disabled={isApplyingGlue}
              className="py-2"
            />
          </div>
          
          <Button 
            className="w-full"
            onClick={onApplyGlue}
            disabled={isApplyingGlue || !confirmedThickness}
          >
            {isApplyingGlue ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Applying Glue...
              </>
            ) : (
              <>
                <FlaskConical className="mr-2 h-4 w-4" />
                Apply Glue
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// Simulated sensor data
const initialSensorData = {
  temperature: { current: 23.5, max: 25, min: 18 },
  humidity: { current: 45, max: 60, min: 30 },
  lastUpdate: new Date().toISOString(),
}

export default function Dashboard() {
  // State management with better organization
  const [sensorData, setSensorData] = useState(initialSensorData)
  const [robotStatus, setRobotStatus] = useState("Idle")
  const [adhesiveProgress, setAdhesiveProgress] = useState(0)
  const [alerts, setAlerts] = useState<{ type: "error" | "warning" | "success"; message: string }[]>([])
  const [now, setNow] = useState<string>("");
  
  // Box Girder state
  const [selectedSegments, setSelectedSegments] = useState<BoxGirderSegment[]>([]);
  const [statusLog, setStatusLog] = useState<string[]>(["Ready. Select segments to apply glue."]);
  const [suggestedThickness] = useState<number>(5);
  const [confirmedThickness, setConfirmedThickness] = useState<number>(5);
  const [isApplyingGlue, setIsApplyingGlue] = useState(false);

  // Set time on client only
  useEffect(() => {
    setNow(new Date().toLocaleTimeString());
    const interval = setInterval(() => setNow(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => ({
        temperature: {
          ...prev.temperature,
          current: prev.temperature.current + (Math.random() - 0.5),
        },
        humidity: {
          ...prev.humidity,
          current: prev.humidity.current + (Math.random() - 0.5),
        },
        lastUpdate: new Date().toISOString(),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Handle segment selection change
  const handleSegmentSelectionChange = useCallback((segments: BoxGirderSegment[]) => {
    const selected = segments.filter(s => s.selected);
    
    // Compare arrays before updating to avoid unnecessary rerenders
    const areArraysEqual = (
      selected.length === selectedSegments.length && 
      selected.every((seg, i) => seg.id === selectedSegments[i]?.id)
    );
    
    if (!areArraysEqual) {
      setSelectedSegments(selected);
      
      if (selected.length > 0 && statusLog[statusLog.length - 1] !== "Segments selected for gluing.") {
        setStatusLog(prev => [...prev, "Segments selected for gluing."]);
      }
    }
  }, [selectedSegments, statusLog]);

  // Handle thickness change with validation
  const handleThicknessChange = useCallback((value: number) => {
    // Ensure value is between 0.1 and 10
    const validValue = Math.max(0.1, Math.min(10, value));
    setConfirmedThickness(validValue);
  }, []);

  // Clear all segment selections
  const handleClearSelections = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).boxGirderViewActions) {
      (window as any).boxGirderViewActions.clearAllSelections();
      setStatusLog(prev => [...prev, "All selections cleared."]);
    }
  }, []);

  // Apply glue to selected segments with error handling
  const handleApplyGlue = useCallback(() => {
    if (selectedSegments.length === 0) {
      setStatusLog(prev => [...prev, "Error: No segments selected for gluing."]);
      return;
    }

    if (confirmedThickness <= 0) {
      setStatusLog(prev => [...prev, "Error: Please enter a valid glue thickness."]);
      return;
    }

    setIsApplyingGlue(true);
    setRobotStatus("Working");
    setAdhesiveProgress(0);
    
    // Log the operation
    setStatusLog(prev => [
      ...prev, 
      `Applying ${confirmedThickness}mm glue to: ${selectedSegments.map(s => s.id).join(", ")}`
    ]);

    // Call the 3D view method to update visuals
    if (typeof window !== 'undefined' && (window as any).boxGirderViewActions) {
      (window as any).boxGirderViewActions.applyGlue(confirmedThickness);
    }

    // Simulate progress with optimized animation
    const startTime = Date.now();
    const duration = 8000; // 8 seconds total
    const updateInterval = 100; // Update every 100ms for smoother animation
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for more natural progress
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      setAdhesiveProgress(Math.round(easedProgress * 100));
      
      if (progress < 1) {
        setTimeout(updateProgress, updateInterval);
      } else {
        setIsApplyingGlue(false);
        setRobotStatus("Idle");
        setStatusLog(prev => [...prev, "Glue application complete."]);
        
        // Add simulated alert
        setAlerts(prev => [
          { 
            type: "success", 
            message: `Glue application completed: ${selectedSegments.length} segments, ${confirmedThickness}mm thickness` 
          },
          ...prev
        ]);
      }
    };
    
    updateProgress();
  }, [selectedSegments, confirmedThickness]);

  // Only render after time is set on client
  if (!now) return null;

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Precast Construction Control Center</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">{now}</div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Power className="w-3.5 h-3.5" />
            Connected
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        {/* Left Column - Environmental Controls and Adhesive System */}
        <div className="md:col-span-1 space-y-4">
          {/* Environmental Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle>Environmental Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <EnvironmentalGauge
                  value={sensorData.temperature.current}
                  min={sensorData.temperature.min}
                  max={sensorData.temperature.max}
                  title="Temperature"
                  unit="°C"
                  icon={<ThermometerIcon className="w-4 h-4" />}
                />
                <EnvironmentalGauge
                  value={sensorData.humidity.current}
                  min={sensorData.humidity.min}
                  max={sensorData.humidity.max}
                  title="Humidity"
                  unit="%"
                  icon={<AlertCircle className="w-4 h-4" />}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(sensorData.lastUpdate).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>

          {/* Adhesive Application */}
          <Card>
            <CardHeader>
              <CardTitle>Adhesive System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Application Progress</span>
                  <span>{adhesiveProgress}%</span>
                </div>
                <Progress value={adhesiveProgress} />
              </div>
              <div className="space-y-2">
                <div className="text-sm">Viscosity: 1200 cP</div>
                <div className="text-sm">Temperature: 25°C</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Box Girder Gluing Operation */}
        <Card className="md:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 pb-3">
            <CardTitle>Box Girder Gluing Operation</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="destructive" size="sm" className="gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Emergency Stop
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Calibrate</DropdownMenuItem>
                  <DropdownMenuItem>Reset Position</DropdownMenuItem>
                  <DropdownMenuItem>System Check</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 p-4">
              {/* Box Girder 3D View with status overlay */}
              <div className="h-[320px] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden relative">
                <RoboticArm onSegmentSelectionChange={handleSegmentSelectionChange} />
                
                {/* Status Overlay */}
                <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-white text-xs">
                  <div className={`w-2 h-2 rounded-full ${robotStatus === "Idle" ? "bg-yellow-500" : "bg-green-500 animate-pulse"}`} />
                  <span>{robotStatus}</span>
                </div>
                
                {/* Progress Overlay */}
                {isApplyingGlue && (
                  <div className="absolute bottom-3 left-3 right-3 bg-black/40 backdrop-blur-sm p-2 rounded">
                    <div className="flex justify-between text-xs text-white mb-1">
                      <span>Applying Glue</span>
                      <span>{adhesiveProgress}%</span>
                    </div>
                    <Progress 
                      value={adhesiveProgress} 
                      className="h-1.5"
                    />
                  </div>
                )}
              </div>
              
              {/* Controls Section - using grid for better layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                  <ProjectInfoCard 
                    projectId="BG-XYZ-001"
                    temperature={sensorData.temperature.current}
                    humidity={sensorData.humidity.current}
                    time={now}
                  />
                  <StatusLogCard logs={statusLog} />
                </div>
                
                <div className="flex flex-col space-y-4">
                  <GluingAreaCard 
                    selectedSegments={selectedSegments}
                    onClearSelections={handleClearSelections}
                  />
                  <GlueThicknessCard
                    suggestedThickness={suggestedThickness}
                    confirmedThickness={confirmedThickness}
                    isApplyingGlue={isApplyingGlue}
                    onChangeThickness={handleThicknessChange}
                    onApplyGlue={handleApplyGlue}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision System - Full width */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Vision System</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="live">
              <TabsList>
                <TabsTrigger value="live">Live Feed</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="live">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Camera Feed Unavailable</span>
                </div>
              </TabsContent>
              <TabsContent value="analysis">
                <div className="space-y-4">
                  <Alert>
                    <Check className="w-4 h-4" />
                    <AlertDescription>All alignment markers detected and verified</AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Production Metrics and System Alerts - Full width */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Production Metrics</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>

        {/* Alert System */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>System Alerts</CardTitle>
            <Button variant="outline" size="sm">
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <AlertHistory alertsData={alerts} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

