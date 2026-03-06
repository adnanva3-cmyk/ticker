/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { StockChart } from './components/StockChart';
import { MediaPlayer } from './components/MediaPlayer';
import { useStockData } from './hooks/useStockData';
import { ArrowUp, ArrowDown, Activity, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function App() {
  const { data, stockInfo } = useStockData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isPositive = stockInfo.change >= 0;
  const color = isPositive ? '#10b981' : '#ef4444'; // Emerald-500 or Red-500

  return (
    <div 
      className="bg-black text-white overflow-hidden relative font-sans"
      style={{ width: '5504px', height: '602px' }}
    >
      {/* Background Grid Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />

      <div className="flex h-full w-full">
        {/* Left Sidebar - Stock Info */}
        <div className="w-[800px] h-full bg-zinc-900/80 backdrop-blur-md border-r border-zinc-800 p-12 flex flex-col justify-between z-10 shrink-0">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-4 mb-4 opacity-70">
              <Activity className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-mono tracking-wider">LIVE MARKET DATA</span>
            </div>
            <h1 className="text-9xl font-bold tracking-tighter mb-2">{stockInfo.symbol}</h1>
            <p className="text-4xl text-zinc-400 font-light">{stockInfo.name}</p>
          </div>

          {/* Price Display */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-6">
              <span className="text-[140px] font-bold leading-none tracking-tight">
                {stockInfo.currentPrice.toFixed(2)}
              </span>
              <span className="text-4xl text-zinc-500 font-medium">USD</span>
            </div>
            
            <div className={`flex items-center gap-4 text-5xl font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <ArrowUp className="w-16 h-16" /> : <ArrowDown className="w-16 h-16" />}
              <span>{stockInfo.change > 0 ? '+' : ''}{stockInfo.change.toFixed(2)}</span>
              <span className="opacity-60">({stockInfo.changePercent.toFixed(2)}%)</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-8 mt-8 border-t border-zinc-800 pt-8">
            <div>
              <p className="text-zinc-500 text-xl uppercase tracking-wider mb-1">Volume</p>
              <p className="text-4xl font-mono">{stockInfo.volume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xl uppercase tracking-wider mb-1">Market Cap</p>
              <p className="text-4xl font-mono">{stockInfo.marketCap}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xl uppercase tracking-wider mb-1">Day High</p>
              <p className="text-4xl font-mono text-emerald-400/80">{stockInfo.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xl uppercase tracking-wider mb-1">Day Low</p>
              <p className="text-4xl font-mono text-red-400/80">{stockInfo.low.toFixed(2)}</p>
            </div>
          </div>

          {/* Footer Time */}
          <div className="mt-auto pt-8 flex items-center gap-4 text-zinc-500">
            <Clock className="w-6 h-6" />
            <span className="text-2xl font-mono">
              {format(currentTime, 'yyyy-MM-dd HH:mm:ss')}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xl uppercase tracking-widest">Connected</span>
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 h-full relative bg-gradient-to-b from-black to-zinc-900">
          {/* Chart Header Overlay */}
          <div className="absolute top-8 left-12 z-10 flex gap-8">
             <div className="bg-zinc-900/50 backdrop-blur px-6 py-3 rounded-full border border-zinc-800 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-medium text-zinc-300">Intraday Trend</span>
             </div>
             <div className="bg-zinc-900/50 backdrop-blur px-6 py-3 rounded-full border border-zinc-800 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-medium text-zinc-300">Real-time Executions</span>
             </div>
          </div>

          <div className="w-full h-full p-0">
            <StockChart data={data} color={color} />
          </div>

          {/* Media Player Widget */}
          <MediaPlayer />
        </div>
      </div>
    </div>
  );
}
