"use client"

import { useEffect, useState } from "react"
import TrajectoryChart from "@/components/TrajectoryChart"
import {
  fetchBiomarkerHistory,
  getScenarios,
  BiomarkerType,
  ScenarioType,
} from "@/lib/mockData"
import { generateProjection } from "@/lib/projection"

export default function Page() {
  const [biomarker, setBiomarker] =
    useState<BiomarkerType>("cholesterol")
  const [scenario, setScenario] =
    useState<ScenarioType>("baseline")
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchBiomarkerHistory(biomarker)
      setHistory(data)
      setLoading(false)
    }
    load()
  }, [biomarker])

  const projectedData = generateProjection(history, scenario, 4)

  const scenarios = getScenarios()

  const latest = history[history.length - 1]?.value
  const projectedEnd =
    projectedData[projectedData.length - 1]?.value

  const delta =
    latest && projectedEnd
      ? (projectedEnd - latest).toFixed(1)
      : null

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-5xl space-y-12">
        {/* Header Block */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Trajectory Preview
          </h1>

          <p className="text-[15px] text-[var(--muted)] max-w-xl leading-relaxed">
            Forward projection derived from recent longitudinal
            biomarker slope. Scenario toggles simulate behavioral
            adjustments over time.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <label className="block text-xs uppercase tracking-wide text-[var(--muted)] mb-2">
              Biomarker
            </label>

            <select
              value={biomarker}
              onChange={(e) =>
                setBiomarker(e.target.value as BiomarkerType)
              }
              className="px-4 py-2 rounded-xl border border-[var(--border)] bg-white text-sm"
            >
              <option value="cholesterol">
                Cholesterol (mg/dL)
              </option>
              <option value="resting_hr">
                Resting Heart Rate (bpm)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-[var(--muted)] mb-2">
              Scenario
            </label>

            <div className="flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.type}
                  onClick={() =>
                    setScenario(s.type as ScenarioType)
                  }
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    scenario === s.type
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "bg-white text-[var(--muted)] border-[var(--border)] hover:border-gray-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="h-[420px] flex items-center justify-center text-[var(--muted)]">
            Loading longitudinal data…
          </div>
        ) : (
          <TrajectoryChart data={projectedData} color="var(--accent)" />
        )}

        {/* Insight Panel */}
        {!loading && delta && (
          <div className="bg-[var(--card)] rounded-2xl shadow-sm p-8 border border-[var(--border)] space-y-4">
            <h2 className="text-lg font-medium">
              Projection Summary
            </h2>

            <p className="text-[15px] text-[var(--muted)] leading-relaxed">
              Based on the current trajectory, this biomarker is
              projected to{" "}
              <span
                className={`font-semibold ${
                  Number(delta) > 0
                    ? "text-[var(--danger)]"
                    : "text-[var(--accent)]"
                }`}
              >
                {Number(delta) > 0 ? "increase" : "decrease"}{" "}
                by {Math.abs(Number(delta))}
              </span>{" "}
              over the next 12 months.
            </p>

            <p className="text-xs text-gray-400">
              Projection is trend-derived and intended for
              exploratory use. Clinical interpretation should
              consider longitudinal depth and contextual inputs.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
