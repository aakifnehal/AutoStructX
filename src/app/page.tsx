"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Check, Download, Power, Settings, ThermometerIcon } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RoboticArm } from "../components/robotic-arm"
import { EnvironmentalGauge } from "../components/environmental-gauge"
import { LineChart } from "../components/line-chart"
import { AlertHistory } from "../components/alert-history"

// Simulated sensor data
const initialSensorData = {
  temperature: { current: 23.5, max: 25, min: 18 },
  humidity: { current: 45, max: 60, min: 30 },
  lastUpdate: new Date().toISOString(),
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(initialSensorData)
  const [robotStatus, setRobotStatus] = useState("Idle")
  const [adhesiveProgress, setAdhesiveProgress] = useState(0)
  const [alerts, setAlerts] = useState<{ type: "error" | "warning" | "success"; message: string }[]>([])

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

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Precast Construction Control Center</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">{new Date().toLocaleTimeString()}</div>
          <Button variant="outline" size="sm">
            <Power className="w-4 h-4 mr-2" />
            Connected
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Robotic Arm Control */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Robotic Arm Control</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="destructive" size="sm">
                Emergency Stop
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
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
          <CardContent>
            <div className="h-[300px] bg-muted rounded-lg overflow-hidden">
              <Canvas>
                <OrbitControls />
                <RoboticArm />
                <Environment preset="warehouse" />
              </Canvas>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    robotStatus === "Idle" ? "bg-yellow-500" : robotStatus === "Working" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm">{robotStatus}</span>
              </div>
              <Button onClick={() => setRobotStatus("Working")}>Start Adhesive Application</Button>
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

        {/* Vision System */}
        <Card className="md:col-span-2">
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

        {/* Data Dashboard */}
        <Card className="md:col-span-2">
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
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>System Alerts</CardTitle>
            <Button variant="outline" size="sm">
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <AlertHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

