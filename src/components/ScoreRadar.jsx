import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { dimensions } from '../data/dimensions'

export default function ScoreRadar({ scores }) {
  const data = dimensions.map((d) => ({
    dim: d.short,
    value: scores[d.id] ?? 0,
  }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="dim" tick={{ fill: '#475569', fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
        <Radar
          dataKey="value"
          stroke="#1f4ff0"
          fill="#326dfb"
          fillOpacity={0.35}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
