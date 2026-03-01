"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface RatingRadarProps {
  ratingDanger: number;
  ratingCost: number;
  ratingPressure: number;
  ratingTransparency: number;
  ratingExit: number;
}

export default function RatingRadar(props: RatingRadarProps) {
  const data = [
    { axis: "危険度", value: props.ratingDanger },
    { axis: "金銭的リスク", value: props.ratingCost },
    { axis: "勧誘の強さ", value: props.ratingPressure },
    { axis: "不透明さ", value: props.ratingTransparency },
    { axis: "脱退の難しさ", value: props.ratingExit },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={false} axisLine={false} />
        <Radar
          dataKey="value"
          stroke="#dc2626"
          fill="#dc2626"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
