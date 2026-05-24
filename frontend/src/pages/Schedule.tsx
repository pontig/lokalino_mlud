import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

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
  console.log(value)
  if (Number(value) === 0) {
    return `rgb(200,200,200)`; // Gray for zero
  }
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
      <div className="content content-ml">
        <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", minHeight: "300px", padding: "20px" }}>
          {periods.map((period) => (
        <div key={period.P_id} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div
            style={{
          width: "100%",
          height: `${(period.Num_Providers / maxProviders) * 250}px`,
          background: getGradientColor(
            period.Num_Providers,
            minProviders,
            maxProviders
          ),
          borderRadius: "4px 4px 0 0",
          transition: "all 0.3s ease"
            }}
          />
          <p style={{ marginTop: "8px", fontSize: "12px", textAlign: "center" }}>
            <b>{period.Description}</b>
          </p>
          <p style={{ fontSize: "11px", margin: "4px 0" }}>
            {period.Num_Providers}
          </p>
        </div>
          ))}
        </div>
      </div>

  );
};

export default Schedule;