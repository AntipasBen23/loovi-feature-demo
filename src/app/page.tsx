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
    <main className="min-h-screen bg-[#f8fafc] flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-5xl space-y-10">
        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-gray-900">
            Health Trajectory Preview
          </h1>
          <p className="text-gray-500 max-w-xl">
            Projection based on recent biomarker trend.
            Scenario adjustments simulate behavior shifts.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex gap-4">
            <select
              value={biomarker}
              onChange={(e) =>
                setBiomarker(e.target.value as BiomarkerType)
              }
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white"
            >
              <option value="cholesterol">
                Cholesterol (mg/dL)
              </option>
              <option value="resting_hr">
                Resting Heart Rate (bpm)
              </option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {scenarios.map((s) => (
              <button
                key={s.type}
                onClick={() =>
                  setScenario(s.type as ScenarioType)
                }
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  scenario === s.type
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="h-[420px] flex items-center justify-center text-gray-400">
            Loading biomarker data...
          </div>
        ) : (
          <TrajectoryChart data={projectedData} />
        )}

        {/* Insight Panel */}
        {!loading && delta && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Trajectory Insight
            </h2>

            <p className="text-gray-600">
              Over the next 12 months, this biomarker is
              projected to{" "}
              <span
                className={`font-semibold ${
                  Number(delta) > 0
                    ? "text-red-500"
                    : "text-teal-600"
                }`}
              >
                {Number(delta) > 0 ? "increase" : "decrease"}{" "}
                by {Math.abs(Number(delta))}.
              </span>
            </p>

            <p className="text-gray-400 text-sm mt-3">
              Projection derived from recent slope.
              For clinical use, longitudinal data depth and
              contextual variables should be considered.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
