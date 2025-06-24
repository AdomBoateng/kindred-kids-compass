import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceDataPoint {
  testName: string;
  averageScore: number;
  participationRate: number;
}

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
  title: string;
  description?: string;
}

export function PerformanceChart({ data, title, description }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                dataKey="testName" 
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
                formatter={(value: number, name: string) => {
                  const label = name === 'averageScore' ? 'Average Score' : 'Participation';
                  return [`${value}%`, label];
                }}
                contentStyle={{
                  backgroundColor: '#FFC107',
                  border: '1px solid #040273',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#040273',
                }}
              />
              <Bar 
                dataKey="averageScore" 
                name="averageScore" 
                fill="#040273"
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="participationRate" 
                name="participationRate" 
                fill="#FFC107"
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center mt-4 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#040273" }}></div>
            <span className="text-sm" style={{ color: "#040273" }}>Average Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFC107" }}></div>
            <span className="text-sm" style={{ color: "#FFC107" }}>Participation Rate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
