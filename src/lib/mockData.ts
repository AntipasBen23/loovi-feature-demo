// frontend/src/lib/mockData.ts

export type BiomarkerPoint = {
  date: string
  value: number
}

export type BiomarkerType = "cholesterol" | "resting_hr"

export type ScenarioType =
  | "baseline"
  | "improve_sleep"
  | "increase_activity"
  | "reduce_hr"

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Mock longitudinal data (quarterly blood panel example)
const biomarkerData: Record<BiomarkerType, BiomarkerPoint[]> = {
  cholesterol: [
    { date: "2024-01-01", value: 198 },
    { date: "2024-04-01", value: 202 },
    { date: "2024-07-01", value: 207 },
    { date: "2024-10-01", value: 212 },
    { date: "2025-01-01", value: 218 },
  ],
  resting_hr: [
    { date: "2024-01-01", value: 72 },
    { date: "2024-04-01", value: 74 },
    { date: "2024-07-01", value: 73 },
    { date: "2024-10-01", value: 76 },
    { date: "2025-01-01", value: 78 },
  ],
}

export async function fetchBiomarkerHistory(
  biomarker: BiomarkerType
): Promise<BiomarkerPoint[]> {
  await delay(400)
  return biomarkerData[biomarker]
}

// Scenario metadata (lightweight behavioral assumptions)
export const scenarioConfig: Record<
  ScenarioType,
  { label: string; slopeAdjustment: number }
> = {
  baseline: {
    label: "Continue current pattern",
    slopeAdjustment: 0,
  },
  improve_sleep: {
    label: "Improve sleep consistency (+15%)",
    slopeAdjustment: -0.8,
  },
  increase_activity: {
    label: "Increase weekly activity (+20%)",
    slopeAdjustment: -1.2,
  },
  reduce_hr: {
    label: "Reduce resting HR (-5 bpm)",
    slopeAdjustment: -0.5,
  },
}

export function getScenarios(): {
  type: ScenarioType
  label: string
}[] {
  return Object.entries(scenarioConfig).map(([type, config]) => ({
    type: type as ScenarioType,
    label: config.label,
  }))
}
