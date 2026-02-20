import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AttendanceDataPoint {
  date: string;
  rate: number;
  students: number;
}

interface AttendanceChartProps {
  data: AttendanceDataPoint[];
  title?: string;
  description?: string;
  showLegend?: boolean;
  height?: number;
}

export function AttendanceChart({ data, title, description, showLegend = true, height = 300 }: AttendanceChartProps) {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div className={`h-[${height}px]`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#040273" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: "#040273" }} 
                tickLine={false}
                axisLine={{ stroke: '#040273' }}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#040273" }}
                tickLine={false}
                axisLine={{ stroke: '#040273' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Attendance Rate']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: '#FFC107',
                  border: '1px solid #040273',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#040273',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#040273" 
                fill="#FFC107"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
