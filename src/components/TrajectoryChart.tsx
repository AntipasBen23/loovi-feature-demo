// frontend/src/components/TrajectoryChart.tsx

"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

type Point = {
  date: string
  value: number
  projected?: boolean
}

type Props = {
  data: Point[]
  color?: string
}

export default function TrajectoryChart({
  data,
  color = "#0f766e",
}: Props) {
  const historical = data.filter((d) => !d.projected)
  const projected = data.filter((d) => d.projected)

  return (
    <div className="w-full h-[420px] bg-white rounded-2xl shadow-sm p-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="date"
            type="category"
            allowDuplicatedCategory={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            domain={["auto", "auto"]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />

          {/* Historical */}
          <Line
            data={historical}
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4 }}
            isAnimationActive={false}
          />

          {/* Projected */}
          <Line
            data={projected}
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            strokeDasharray="6 6"
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
