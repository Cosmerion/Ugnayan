import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonthlyAttendance } from '../types';

interface AttendanceBarChartProps {
  data: MonthlyAttendance[];
}

/**
 * Attendance bar chart for the MemberDetailModal.
 * Computes pct = Math.round((attended / total) * 100) per month.
 */
export default function AttendanceBarChart({ data }: AttendanceBarChartProps) {
  const chartData = data.map(d => ({
    month: d.month,
    pct: d.total > 0 ? Math.round((d.attended / d.total) * 100) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8B86D" />
        <XAxis
          dataKey="month"
          tick={{ fill: '#6B3F1F', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={v => `${v}%`}
          tick={{ fill: '#6B3F1F', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
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
        <Bar dataKey="pct" fill="#C8922A" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
