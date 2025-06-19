import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/SubmissionForm.css";
import { Link } from "react-router-dom";

const BackupDatabase: React.FC = () => {
  const api = {
    baseUrl: "/be",

    async fetchDB(): Promise<void> {
      const response = await fetch(`${api.baseUrl}/dbDump.php`, {
        method: "GET",
      });

      if (response.status === 401) {
        navigator("/login");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch database dump");
      const data = await response.text();
      setDump(data);
    },
  };

  // Navigation and state
  const navigator = useNavigate();
  const [dump, setDump] = useState("");

  // Effects
  useEffect(() => {
    api.fetchDB();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 style={{ textAlign: "center" }}>Iscritti alla mailing list</h1>
      <div className="search-container">
        <Link to="/backOffice" className="back-button">
          ← Torna alla Dashboard
        </Link>
      </div>
      <div className="content content-ml">
        <textarea
          value={dump}
          readOnly
          style={{ width: "100%", height: "60vh" }}
        />
      </div>
      <div className="content content-ml">
        <button
          onClick={() => {
            const now = new Date();
            const datetime = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `mlud_${datetime}.sql`;
            
            const blob = new Blob([dump], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="submit-button"
          disabled={!dump}
        >
          Scarica Backup
        </button>
      </div>
    </div>
  );
};

export default BackupDatabase;
