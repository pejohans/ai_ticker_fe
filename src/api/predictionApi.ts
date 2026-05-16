import axios from "axios";
import type { PredictionResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function fetchPrediction(
  symbol: string,
  horizonDays: number
): Promise<PredictionResponse> {
  const response = await axios.get(`${API_BASE_URL}/predict`, {
    params: {
      symbol,
      horizonDays,
    },
  });

  return response.data;
}


export async function fetchMockPrediction(
  symbol: string,
  horizonDays: number
): Promise<PredictionResponse> {
  console.log("Mock API call:", symbol, horizonDays);

  // simulera latency (t.ex. 500 ms)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const currentPrice = 80 + Math.random() * 20;

  // ±8% intervall från current price
  const maxMove = 0.08;

  const lowerPrice = currentPrice * (1 - maxMove);
  const upperPrice = currentPrice * (1 + maxMove);

  // ✅ predicted ska ligga INOM intervallet
  const predictedPrice = lowerPrice + Math.random() * (upperPrice - lowerPrice);

  const dummy: PredictionResponse = {
    symbol,
    horizon_days: horizonDays,
    predicted_return: predictedPrice,
    lower_return: lowerPrice,
    upper_return: upperPrice,
    confidence: 0.8 + Math.random() * 0.1,
    model_version: "mock-v5",
    generated_at: new Date().toISOString(),
    current_price: currentPrice,
  };

  console.log("Mock prediction generated:", dummy);

  return dummy;
}