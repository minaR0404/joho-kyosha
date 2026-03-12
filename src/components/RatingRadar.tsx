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
  compact?: boolean;
}

function CustomTick({ payload, x, y, textAnchor, fontSize }: { payload: { value: string }; x: number; y: number; textAnchor: "start" | "middle" | "end" | "inherit" | undefined; fontSize: number }) {
  const lines = payload.value.split("\n");
  return (
    <text x={x} y={y} textAnchor={textAnchor} fontSize={fontSize} fill="#666">
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : fontSize * 1.2}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function RatingRadar({ compact, ...props }: RatingRadarProps) {
  const data = [
    { axis: "危険度", value: props.ratingDanger },
    { axis: "金銭的リスク", value: props.ratingCost },
    { axis: "勧誘の強さ", value: props.ratingPressure },
    { axis: "不透明さ", value: props.ratingTransparency },
    { axis: "解約・脱退の\n難しさ", value: props.ratingExit },
  ];

  const fontSize = compact ? 10 : 11;

  return (
    <ResponsiveContainer width="100%" height={compact ? 200 : 260}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius={compact ? "55%" : "58%"}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="axis"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tick={(tickProps: any) => <CustomTick payload={tickProps.payload} x={tickProps.x} y={tickProps.y} textAnchor={tickProps.textAnchor} fontSize={fontSize} />}
        />
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
