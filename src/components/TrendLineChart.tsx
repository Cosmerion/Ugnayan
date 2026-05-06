import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendDataPoint } from '../types';

interface TrendLineChartProps {
  data: TrendDataPoint[];
}

export default function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <div className="baro-panel rounded-[28px] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-baro-terra">Pulse</p>
      <h2 className="mt-2 mb-5 font-display text-[1.85rem] leading-none text-baro-brown">
        Monthly Attendance Trend
      </h2>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8B86D" />
          <XAxis dataKey="month" tick={{ fill: '#6B3F1F', fontSize: 12 }} tickLine={false} />
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
            formatter={value => [`${value ?? 0}%`, 'Attendance']}
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
