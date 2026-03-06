import { useState, useEffect, useCallback } from 'react';

export interface StockDataPoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface StockInfo {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap: string;
}

// Simulation configuration
const INITIAL_PRICE = 450.00;
const VOLATILITY = 0.002; // 0.2% volatility per tick
const TREND = 0.0001; // Slight upward trend
const UPDATE_INTERVAL = 1000; // 1 second

export function useStockData() {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [stockInfo, setStockInfo] = useState<StockInfo>({
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: INITIAL_PRICE,
    change: 0,
    changePercent: 0,
    high: INITIAL_PRICE,
    low: INITIAL_PRICE,
    volume: 15000000,
    marketCap: '2.8T'
  });

  // Initialize with some historical data so the graph isn't empty
  useEffect(() => {
    const initialData: StockDataPoint[] = [];
    let currentPrice = INITIAL_PRICE;
    const now = Date.now();
    // Generate 200 points of history (approx 3.5 hours of minutes if 1pt/min, but here we do 1pt/sec for "live" feel)
    // For a 5504px screen, we need A LOT of points to make it look good.
    // Let's generate 500 points initially.
    for (let i = 500; i > 0; i--) {
      const change = currentPrice * (Math.random() * VOLATILITY * 2 - VOLATILITY + TREND);
      currentPrice += change;
      initialData.push({
        timestamp: now - i * UPDATE_INTERVAL,
        price: Math.max(0.01, currentPrice),
        volume: Math.floor(Math.random() * 10000)
      });
    }
    setData(initialData);
    updateStockInfo(currentPrice, initialData);
  }, []);

  const updateStockInfo = (currentPrice: number, history: StockDataPoint[]) => {
    const startPrice = history[0]?.price || INITIAL_PRICE;
    const change = currentPrice - startPrice;
    const changePercent = (change / startPrice) * 100;
    const prices = history.map(d => d.price);
    
    setStockInfo(prev => ({
      ...prev,
      currentPrice,
      change,
      changePercent,
      high: Math.max(...prices),
      low: Math.min(...prices),
      volume: prev.volume + Math.floor(Math.random() * 5000) // Accumulate volume
    }));
  };

  // Live update loop
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const lastPoint = prevData[prevData.length - 1];
        const lastPrice = lastPoint ? lastPoint.price : INITIAL_PRICE;
        
        // Random walk
        const change = lastPrice * (Math.random() * VOLATILITY * 2 - VOLATILITY + TREND);
        const newPrice = Math.max(0.01, lastPrice + change);
        
        const newPoint: StockDataPoint = {
          timestamp: Date.now(),
          price: newPrice,
          volume: Math.floor(Math.random() * 10000)
        };

        // Keep a fixed window or let it grow? 
        // For 5504px, we can fit a lot. Let's keep 1000 points max.
        const newData = [...prevData, newPoint].slice(-1000);
        
        updateStockInfo(newPrice, newData);
        return newData;
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { data, stockInfo };
}
