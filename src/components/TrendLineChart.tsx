import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrendDataPoint } from '../types';

interface TrendLineChartProps {
  data: TrendDataPoint[];
}

/**
 * TrendLineChart
 *
 * Renders a 6-month attendance percentage trend as a line chart.
 */
export default function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <div className="bg-baro-cream rounded-xl shadow-sm border border-baro-amber/40 p-6">
      <h2 className="font-display text-baro-brown text-lg mb-4">
        Monthly Attendance Trend
      </h2>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8B86D" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6B3F1F', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fill: '#6B3F1F', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: '#F5ECD7',
              border: '1px solid #C8922A',
              borderRadius: '8px',
              color: '#6B3F1F',
            }}
            formatter={(value) => [`${value}%`, 'Attendance']}
          />
          <Line
            type="monotone"
            dataKey="attendancePct"
            stroke="#C8922A"
            strokeWidth={2}
            dot={{ fill: '#6B3F1F', r: 4 }}
            activeDot={{ r: 6, fill: '#C8922A' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
