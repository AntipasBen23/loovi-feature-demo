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

function formatDate(dateStr: string) {
  // "2025-01-01" -> "Jan 2025"
  const d = new Date(dateStr)
  const month = d.toLocaleString("en-US", { month: "short" })
  const year = d.getFullYear()
  return `${month} ${year}`
}

export default function TrajectoryChart({
  data,
  color = "var(--accent)",
}: Props) {
  const historical = data.filter((d) => !d.projected)
  const projected = data.filter((d) => d.projected)

  return (
    <div className="w-full h-[420px] bg-[var(--card)] rounded-2xl shadow-sm border border-[var(--border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-[var(--text)]">
          Trend over time
        </div>
        <div className="text-xs text-[var(--muted)] flex gap-4">
          <span className="flex items-center gap-2">
            <span
              className="inline-block w-6 h-[2px] rounded"
              style={{ background: color }}
            />
            Historical
          </span>
          <span className="flex items-center gap-2">
            <span
              className="inline-block w-6 h-[2px] rounded border-t-2 border-dashed"
              style={{ borderColor: color }}
            />
            Projected
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart>
          <CartesianGrid
            strokeDasharray="4 6"
            stroke="var(--border)"
          />

          <XAxis
            dataKey="date"
            type="category"
            allowDuplicatedCategory={false}
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            tickFormatter={formatDate}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            domain={["auto", "auto"]}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
          />

          <Tooltip
            formatter={(v) => [v, "Value"]}
            labelFormatter={(label) => formatDate(label as string)}
            contentStyle={{
              backgroundColor: "var(--card)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              fontSize: "12px",
            }}
          />

          {/* Historical */}
          <Line
            data={historical}
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />

          {/* Projected */}
          <Line
            data={projected}
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            strokeDasharray="7 7"
            dot={{ r: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
