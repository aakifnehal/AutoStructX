"use client"

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { time: "00:00", temperature: 22, humidity: 45 },
  { time: "04:00", temperature: 21, humidity: 43 },
  { time: "08:00", temperature: 23, humidity: 48 },
  { time: "12:00", temperature: 25, humidity: 50 },
  { time: "16:00", temperature: 24, humidity: 47 },
  { time: "20:00", temperature: 22, humidity: 44 },
]

export function LineChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="temperature" stroke="hsl(var(--primary))" strokeWidth={2} />
        <Line type="monotone" dataKey="humidity" stroke="hsl(var(--secondary))" strokeWidth={2} />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

