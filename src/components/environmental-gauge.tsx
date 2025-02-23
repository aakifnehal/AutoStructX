"use client"

import type React from "react"

interface EnvironmentalGaugeProps {
  value: number
  min: number
  max: number
  title: string
  unit: string
  icon: React.ReactNode
}

export function EnvironmentalGauge({ value, min, max, title, unit, icon }: EnvironmentalGaugeProps) {
  const percentage = ((value - min) / (max - min)) * 100
  const isWarning = value > max * 0.9 || value < min * 1.1
  const isError = value > max || value < min

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span
          className={`text-sm font-bold ${
            isError ? "text-destructive" : isWarning ? "text-yellow-500" : "text-primary"
          }`}
        >
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${isError ? "bg-destructive" : isWarning ? "bg-yellow-500" : "bg-primary"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  )
}

