import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface PeriodWithEmails {
  period_description: string;
  emails: string[];
}

const PeriodEmails: React.FC = () => {
  const api = {
    baseUrl: "/be",
    async fetchPeriods(): Promise<PeriodWithEmails[]> {
      const response = await fetch(`${this.baseUrl}/getPersonsByPeriod.php`);
      if (!response.ok) throw new Error("Failed to fetch periods");
      const data = await response.json();
      setPeriods(data);
      return data;
    },
  };

  const navigate = useNavigate();
  const [periods, setPeriods] = useState<PeriodWithEmails[]>([]);

  useEffect(() => {
    api.fetchPeriods();
  }, []);

  return (
    <div className="bokstore-container form-container">
      <Header
        title={"Visualizza affluenze nominali"}
        hasSearchBox={false}
        onLinkClick={async () => navigate("/backOffice")}
      />
      <div className="content content-ml">
        <div>
          <table className="books-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Emails</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period, index) => (
                <tr key={index}>
                  <td>{period.period_description}</td>
                  <td>{period.emails.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PeriodEmails;
