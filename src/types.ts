export type PredictionResponse = {
  symbol: string;
  horizon_days: number;
  predicted_return: number; // e.g. 0.05 for +5%
  lower_return: number;
  upper_return: number;
  confidence: number; // 0..1
  model_version?: string;
  generated_at: string; // ISO 8601 format
  current_price: number; 
  //currency?: string;
  //asOf?: string;
};