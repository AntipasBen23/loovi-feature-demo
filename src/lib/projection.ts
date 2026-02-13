// frontend/src/lib/projection.ts

import { BiomarkerPoint, ScenarioType } from "./mockData"
import { scenarioConfig } from "./mockData"

export type ProjectionPoint = {
  date: string
  value: number
  projected?: boolean
}

// Simple linear regression slope calculation
function calculateSlope(data: BiomarkerPoint[]): number {
  const n = data.length
  if (n < 2) return 0

  const xVals = data.map((_, i) => i)
  const yVals = data.map((d) => d.value)

  const xMean = xVals.reduce((a, b) => a + b, 0) / n
  const yMean = yVals.reduce((a, b) => a + b, 0) / n

  let numerator = 0
  let denominator = 0

  for (let i = 0; i < n; i++) {
    numerator += (xVals[i] - xMean) * (yVals[i] - yMean)
    denominator += (xVals[i] - xMean) ** 2
  }

  return denominator === 0 ? 0 : numerator / denominator
}

function addMonths(dateStr: string, months: number): string {
  const date = new Date(dateStr)
  date.setMonth(date.getMonth() + months)
  return date.toISOString().split("T")[0]
}

export function generateProjection(
  history: BiomarkerPoint[],
  scenario: ScenarioType,
  monthsForward: number = 4
): ProjectionPoint[] {
  if (!history.length) return []

  const baseSlope = calculateSlope(history)
  const slopeAdjustment = scenarioConfig[scenario].slopeAdjustment
  const adjustedSlope = baseSlope + slopeAdjustment

  const result: ProjectionPoint[] = history.map((p) => ({
    ...p,
    projected: false,
  }))

  const lastPoint = history[history.length - 1]

  for (let i = 1; i <= monthsForward; i++) {
    const projectedValue =
      lastPoint.value + adjustedSlope * i

    result.push({
      date: addMonths(lastPoint.date, i * 3), // quarterly projection
      value: Number(projectedValue.toFixed(1)),
      projected: true,
    })
  }

  return result
}
