import React, { useEffect } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";

import "../styles/stats.css";
import { BarChart } from "@mui/x-charts";

interface HighSchoolRatio {
  Is_HighSchool: string;
  persons_cnt: number;
}

interface BooksPerSchool {
  Name: string;
  books_cnt: number;
}

const Stats: React.FC = () => {
  const api = {
    baseUrl: "http://lokalinomlud.altervista.org/be/stats",
    // baseUrl: "/be/stats",

    async fetchHighSchoolRatio(): Promise<void> {
      const response = await fetch(`${this.baseUrl}/getHighSchoolRatio.php`);
      if (!response.ok) throw new Error("Failed to fetch high school ratio");
      const data = (await response.json()) as HighSchoolRatio[];
      const highSchoolCount =
        data.find((item) => item.Is_HighSchool === "1")?.persons_cnt || 0;
      const mediumSchoolCount =
        data.find((item) => item.Is_HighSchool === "0")?.persons_cnt || 0;
      setNumHighSchools(highSchoolCount);
      setNumMediumSchools(mediumSchoolCount);
    },

    async fetchTotalMoneyMovement(): Promise<void> {
      const response = await fetch(`${this.baseUrl}/getTotalMoneyMovement.php`);
      if (!response.ok) throw new Error("Failed to fetch total money movement");
      const data = await response.json();
      setTotalMoneyMovement(data);
    },

    async fetchNumNewMailSubscribers(): Promise<void> {
      const response = await fetch(
        `${this.baseUrl}/getNumNewMailSubscribers.php`
      );
      if (!response.ok) throw new Error("Failed to fetch new mail subscribers");
      const data = await response.json();
      setNumNewMailSubscribers(data);
    },

    async fetchBooksPerSchool(): Promise<void> {
      const response = await fetch(`${this.baseUrl}/getBooksPerSchool.php`);
      if (!response.ok) throw new Error("Failed to fetch books per school");
      const rawData = (await response.json()) as BooksPerSchool[];
      const data = rawData.map((item) => ({
        Name: item.Name,
        books_cnt: Number(item.books_cnt),
      }));
      setBooksPerSchool(data);
    },
  };

  const navigate = useNavigate();
  const [numHischools, setNumHighSchools] = React.useState<number>(-1);
  const [numMediumSchools, setNumMediumSchools] = React.useState<number>(-1);
  const [totalMoneyMovement, setTotalMoneyMovement] =
    React.useState<number>(-1);
  const [numNewMailSubscribers, setNumNewMailSubscribers] =
    React.useState<number>(-1);
  const [booksPerSchool, setBooksPerSchool] = React.useState<BooksPerSchool[]>(
    []
  );

  useEffect(() => {
    api.fetchHighSchoolRatio();
    api.fetchTotalMoneyMovement();
    api.fetchNumNewMailSubscribers();
    api.fetchBooksPerSchool();
  }, []);

  // return <div></div>

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        Statistiche interessanti
      </h1>
      <div
        className="search-container"
        style={{ maxWidth: "1200px", margin: "40px auto" }}
      >
        <Link to="/backOffice" className="back-button">
          ← Torna alla Dashboard
        </Link>
      </div>
      <div className="stats-container">
        <h2>Money money money</h2>
        <p>Totale soldi che sono passati tramite il mlu:</p>
        <p className="big-number">{totalMoneyMovement}€</p>
        <p>
          Ogni persona si stima che sia riuscita a risparmiare sull'acquisto di
          libri una cifra di
        </p>
        <p className="big-number">
          {`${(
            totalMoneyMovement /
            (2 * (numHischools - -numMediumSchools))
          ).toFixed(2)}€`}
        </p>
        <p className="side-note">
          Questa cifra è stata ricavata assumendo che le persone che hanno
          venduto libri siano state tutte persone che hanno poi comprato libri.
        </p>
        <h2>Mail list</h2>
        <p>Il numero di nuovi iscritti alla mail list è:</p>
        <p className="big-number">{numNewMailSubscribers}</p>
        <h2>Scuole di provenienza persone</h2>
        <PieChart
          series={[
            {
              data: [
                { id: 0, label: "Scuole Superiori", value: numHischools },
                { id: 1, label: "Scuole Medie", value: numMediumSchools },
              ],
              highlightScope: { fade: "global", highlight: "item" },
            },
          ]}
          width={300}
          height={300}
        />
        <h2>Distribuzione scuola / libri</h2>
        <p>Numero di libri scambiati al mlu per ogni scuola</p>
        <BarChart
          yAxis={[{width: 300, data: booksPerSchool.map((item) => item.Name)}]}
          series={[{data: booksPerSchool.map((item) => item.books_cnt)}]}
          layout="horizontal"
          height={500}
          />
      </div>
    </div>
  );
};

export default Stats;
