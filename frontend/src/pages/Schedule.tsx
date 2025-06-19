import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Period {
  P_id: number;
  Description: string;
  Num_Providers: number;
}

type RGB = [number, number, number];

const getGradientColor = (
  value: number,
  min: number,
  max: number,
  low: RGB = [204, 0, 0],    // default: red
  mid: RGB = [234, 190, 0],  // default: yellow
  high: RGB = [0, 102, 0]    // default: green
) => {
  // Clamp value
  value = Math.max(min, Math.min(max, value));
  // Normalize to 0-1
  const ratio = 1 - (value - min) / (max - min);

  let color: RGB;
  if (ratio < 0.5) {
    // Interpolate between low and mid
    const t = ratio * 2;
    color = [
      Math.round(low[0] + (mid[0] - low[0]) * t),
      Math.round(low[1] + (mid[1] - low[1]) * t),
      Math.round(low[2] + (mid[2] - low[2]) * t),
    ];
  } else {
    // Interpolate between mid and high
    const t = (ratio - 0.5) * 2;
    color = [
      Math.round(mid[0] + (high[0] - mid[0]) * t),
      Math.round(mid[1] + (high[1] - mid[1]) * t),
      Math.round(mid[2] + (high[2] - mid[2]) * t),
    ];
  }
  return `rgb(${color[0]},${color[1]},${color[2]})`;
};

const Schedule: React.FC = () => {
  const api = {
    baseUrl: "/be",
    async fetchPeriods(): Promise<Period[]> {
      const response = await fetch(
        `${this.baseUrl}/getPeriodsAndAffluences.php`
      );
      if (!response.ok) throw new Error("Failed to fetch periods");
      const data = await response.json();
      setPeriods(data);
      return data;
    },
  };

  const navigate = useNavigate();
  const [periods, setPeriods] = useState<Period[]>([]);

  // Find min and max Num_Providers for gradient scaling
  const minProviders = Math.min(...periods.map(p => p.Num_Providers), 0);
  const maxProviders = Math.max(...periods.map(p => p.Num_Providers), 1);

  useEffect(() => {
    api.fetchPeriods();
  }, []);

  return (
    <div className="bokstore-container form-container">
      <h1 style={{ textAlign: "center" }}>Previsioni affluenze</h1>
      <div className="search-container">
        <Link to="/backOffice" className="back-button">
          ← Torna alla Dashboard
        </Link>
      </div>
      <div className="content content-ml">
        {periods.map((period) => (
          <div
            key={period.P_id}
            className="choice"
            style={{
              background: getGradientColor(
                period.Num_Providers,
                minProviders,
                maxProviders
              ),
              color: "#000"
            }}
          >
            <p>
              <b>{period.Description}</b>
            </p>
            <p>Numero di persone previste: {period.Num_Providers}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;