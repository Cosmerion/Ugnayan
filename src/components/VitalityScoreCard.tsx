import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

interface VitalityScoreCardProps {
  score: number;
}

export default function VitalityScoreCard({ score }: VitalityScoreCardProps) {
  const data = [{ value: score, fill: '#C8922A' }];

  return (
    <div className="baro-panel flex flex-col items-center rounded-[28px] bg-gradient-to-br from-baro-cream/95 to-white/90 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-baro-terra">Health</p>
      <h2 className="mt-2 mb-3 font-display text-[1.85rem] leading-none text-baro-brown">Vitality Score</h2>

      <div className="relative flex items-center justify-center">
        <RadialBarChart
          width={220}
          height={220}
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#E8B86D' }} angleAxisId={0} />
        </RadialBarChart>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-6xl font-bold leading-none text-baro-brown">{score}</span>
          <span className="mt-1 text-sm leading-none tracking-[0.16em] text-baro-amber">OF 100</span>
        </div>
      </div>
    </div>
  );
}
