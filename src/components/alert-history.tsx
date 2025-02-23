"use client"

import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const alerts = [
  {
    timestamp: "2024-02-20 14:35:00",
    type: "error",
    message: "Temperature exceeded maximum threshold",
    acknowledged: true,
  },
  {
    timestamp: "2024-02-20 14:32:00",
    type: "warning",
    message: "Adhesive viscosity approaching lower limit",
    acknowledged: false,
  },
  {
    timestamp: "2024-02-20 14:30:00",
    type: "success",
    message: "Segment assembly completed successfully",
    acknowledged: true,
  },
]

export function AlertHistory() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert.timestamp}>
            <TableCell>{alert.timestamp}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {alert.type === "error" ? (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                ) : alert.type === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className="capitalize">{alert.type}</span>
              </div>
            </TableCell>
            <TableCell>{alert.message}</TableCell>
            <TableCell>
              <span className={`text-sm ${alert.acknowledged ? "text-muted-foreground" : "text-primary"}`}>
                {alert.acknowledged ? "Acknowledged" : "Pending"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

