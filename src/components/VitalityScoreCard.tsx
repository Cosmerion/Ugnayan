import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface VitalityScoreCardProps {
  score: number; // 0–100
}

/**
 * VitalityScoreCard
 *
 * Displays the org vitality score as a full-circle radial gauge
 * with the numeric score overlaid in the center.
 */
export default function VitalityScoreCard({ score }: VitalityScoreCardProps) {
  const data = [{ value: score, fill: '#C8922A' }];

  return (
    <div className="bg-baro-cream rounded-xl shadow-sm border border-baro-amber/40 p-6 flex flex-col items-center">
      <h2 className="font-display text-baro-brown text-lg mb-2">Vitality Score</h2>

      {/* Chart + center overlay */}
      <div className="relative flex items-center justify-center">
        <RadialBarChart
          width={180}
          height={180}
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          {/* Background track */}
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            dataKey="value"
            cornerRadius={8}
            background={{ fill: '#E8B86D' }}
            angleAxisId={0}
          />
        </RadialBarChart>

        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-5xl text-baro-brown font-bold leading-none">
            {score}
          </span>
          <span className="text-baro-amber text-sm leading-none mt-1">/ 100</span>
        </div>
      </div>
    </div>
  );
}
