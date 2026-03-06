import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { StockDataPoint } from '../hooks/useStockData';
import { format } from 'date-fns';

interface StockChartProps {
  data: StockDataPoint[];
  color?: string;
}

export function StockChart({ data, color = '#10b981' }: StockChartProps) {
  if (!data || data.length === 0) return null;

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.3} />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(unixTime) => format(new Date(unixTime), 'HH:mm:ss')}
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
            minTickGap={100}
            hide={false}
          />
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]} 
            orientation="right"
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
            width={80}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
            itemStyle={{ color: '#f3f4f6' }}
            labelFormatter={(label) => format(new Date(label), 'HH:mm:ss')}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false}
          />
          <ReferenceLine y={data[0]?.price} stroke="#666" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
