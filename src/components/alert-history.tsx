"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react";

// Define the alert type
export type Alert = {
  type: "error" | "warning" | "success";
  message: string;
  timestamp?: string;
};

// Default alerts for demonstration
const defaultAlerts: Alert[] = [
  {
    type: "error",
    message: "Emergency stop activated",
    timestamp: "10:24:38",
  },
  {
    type: "warning",
    message: "Temperature above threshold",
    timestamp: "09:15:22",
  },
  {
    type: "success",
    message: "Adhesive system calibration completed",
    timestamp: "08:30:15",
  },
  {
    type: "warning",
    message: "Adhesive level below 30%",
    timestamp: "08:12:45",
  },
  {
    type: "success",
    message: "Vision system online",
    timestamp: "08:00:02",
  },
];

export function AlertHistory({ alertsData = defaultAlerts }: { alertsData?: Alert[] }) {
  const [filterType, setFilterType] = useState<"all" | "error" | "warning" | "success">("all");
  
  // Filter alerts based on selected type
  const filteredAlerts = alertsData.filter(
    alert => filterType === "all" || alert.type === filterType
  );
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 mb-3">
        <Button 
          size="sm" 
          variant={filterType === "all" ? "default" : "outline"} 
          className="h-7 px-2 text-xs"
          onClick={() => setFilterType("all")}
        >
          All
        </Button>
        <Button 
          size="sm" 
          variant={filterType === "error" ? "default" : "outline"} 
          className={`h-7 px-2 text-xs ${filterType === "error" ? "" : "text-red-500"}`}
          onClick={() => setFilterType("error")}
        >
          Errors
        </Button>
        <Button 
          size="sm" 
          variant={filterType === "warning" ? "default" : "outline"} 
          className={`h-7 px-2 text-xs ${filterType === "warning" ? "" : "text-amber-500"}`}
          onClick={() => setFilterType("warning")}
        >
          Warnings
        </Button>
        <Button 
          size="sm" 
          variant={filterType === "success" ? "default" : "outline"} 
          className={`h-7 px-2 text-xs ${filterType === "success" ? "" : "text-green-500"}`}
          onClick={() => setFilterType("success")}
        >
          Success
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {filteredAlerts.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No {filterType !== "all" ? filterType : ""} alerts to display
          </div>
        ) : (
          filteredAlerts.map((alert, index) => (
            <Card key={index} className="overflow-hidden border-l-4 shadow-sm transition-all hover:shadow-md" 
              style={{ 
                borderLeftColor: 
                  alert.type === "error" ? "var(--red-500)" :
                  alert.type === "warning" ? "var(--amber-500)" : 
                  "var(--green-500)"
              }}
            >
              <CardContent className="p-3 flex items-center gap-2">
                {alert.type === "error" && (
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                )}
                {alert.type === "warning" && (
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                )}
                {alert.type === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.message}</p>
                </div>
                
                {alert.timestamp && (
                  <Badge variant="outline" className="shrink-0 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{alert.timestamp}</span>
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

