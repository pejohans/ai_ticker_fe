import { useMemo, useState } from "react";
import { OMX30_STOCKS } from "./data/omx30";
import { fetchPrediction } from "./api/predictionApi";
import type { PredictionResponse } from "./types";
import StatCard from "./compontents/StatCard";

const HORIZONS = [7]; // Lägg till t.ex. 30, 90 senare när backend stödjer det

function formatPrice(value?: number, currency = "SEK") {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  return `${(value * 100).toFixed(1)} %`;
}

function getConfidenceLabel(score?: number) {
  if (score === undefined || score === null) return "-";
  if (score >= 0.8) return "Hög";
  if (score >= 0.6) return "Medel";
  return "Låg";
}

export default function App() {
  const [symbol, setSymbol] = useState("ERIC-B.ST");
  const [horizonDays, setHorizonDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  const selectedStock = useMemo(
    () => OMX30_STOCKS.find((s) => s.value === symbol),
    [symbol]
  );

  const expectedMove = useMemo(() => {
    if (!prediction) return null;
    const delta = prediction.predicted_price - prediction.recent_price;
    const pct = prediction.predicted_return;
    return { delta, pct };
  }, [prediction]);

  async function handleFetch() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPrediction(symbol, horizonDays);
      setPrediction(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Kunde inte hämta prognos från backend."
      );
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <div>
            <h1>AI Ticker</h1>
            <p>
              Välj en OMX30-aktie och få ett uppskattat prisintervall för vald
              tidshorisont.
            </p>
          </div>
        </header>

        <section className="panel controls">
          <div className="field">
            <label htmlFor="stock">Aktie</label>
            <select
              id="stock"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            >
              {OMX30_STOCKS.map((stock) => (
                <option key={stock.value} value={stock.value}>
                  {stock.label} ({stock.value})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="horizon">Tidshorisont</label>
            <select
              id="horizon"
              value={horizonDays}
              onChange={(e) => setHorizonDays(Number(e.target.value))}
            >
              {HORIZONS.map((days) => (
                <option key={days} value={days}>
                  {days} dagar
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleFetch} disabled={loading}>
            {loading ? "Hämtar..." : "Hämta prognos"}
          </button>
        </section>

        {error && <div className="error">{error}</div>}

        {prediction && (
          <>
            <section className="panel">
              <h2>
                Prognos för {selectedStock?.label} ({prediction.symbol})
              </h2>
              <p className="muted">
                Tidshorisont: {prediction.horizon_days} dagar
                {prediction.generated_at ? ` • Genererad: ${prediction.generated_at}` : ""}
              </p>

              <div className="grid">
                <StatCard
                  title="Nuvarande kurs"
                  value={formatPrice(
                    prediction.recent_price,
                    prediction.currency ?? "SEK"
                  )}
                />
                <StatCard
                  title={`Predikterat pris om ${prediction.horizon_days} dagar`}
                  value={formatPrice(
                    prediction.predicted_price,
                    prediction.currency ?? "SEK"
                  )}
                  accent
                />
                <StatCard
                  title="Lägsta uppskattade kurs"
                  value={formatPrice(
                    prediction.lower_price,
                    prediction.currency ?? "SEK"
                  )}
                />
                <StatCard
                  title="Högsta uppskattade kurs"
                  value={formatPrice(
                    prediction.upper_price,
                    prediction.currency ?? "SEK"
                  )}
                />
                <StatCard
                  title="Predikterad avkastning"
                  value={formatPercent(prediction.predicted_return)}
                />
                <StatCard
                  title="Confidence score"
                  value={`${formatPercent(prediction.confidence)} (${getConfidenceLabel(
                    prediction.confidence
                  )})`}
                />
                <StatCard
                  title="Förväntad förändring"
                  value={
                    expectedMove
                      ? `${formatPrice(
                          expectedMove.delta,
                          prediction.currency ?? "SEK"
                        )} (${formatPercent(expectedMove.pct)})`
                      : "-"
                  }
                />
              </div>
            </section>

            <section className="panel range-panel">
              <h3>Prisintervall</h3>
              <div className="range-bar-wrapper">
                <div className="range-labels">
                  <span>
                    Min: {" "}
                    {formatPrice(
                      prediction.lower_price,
                      prediction.currency ?? "SEK"
                    )}
                  </span>
                  <span>
                    Prognos: {" "}
                    {formatPrice(
                      prediction.predicted_price,
                      prediction.currency ?? "SEK"
                    )}
                  </span>
                  <span>
                    Max: {" "}
                    {formatPrice(
                      prediction.upper_price,
                      prediction.currency ?? "SEK"
                    )}
                  </span>
                </div>
                <div className="range-bar">
                  <div className="range-fill" />
                  <div className="range-marker" />
                </div>
              </div>
            </section>
          </>
        )}

        {!prediction && !loading && !error && (
          <section className="panel empty-state">
            <h2>Ingen prognos hämtad ännu</h2>
            <p>
              Välj aktie och tidshorisont och klicka på <strong>Hämta prognos</strong>.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}