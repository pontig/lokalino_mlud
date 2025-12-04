import React, { useEffect, useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";

import "../styles/stats.css";
import { BarChart } from "@mui/x-charts";
import { FaBook, FaTruckMoving } from "react-icons/fa";

interface HighSchoolRatio {
  Is_HighSchool: string;
  persons_cnt: number;
}

interface BooksPerSchool {
  Name: string;
  books_cnt: number;
}

interface SalesPerDay {
  date: string;
  books_sold_that_day: number;
  day_money: number;
}

// Custom hook for number animation
const useCountAnimation = (
  end: number,
  duration: number = 2000,
  delay: number = 0
) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (end <= 0 || hasStarted) return;

    const timer = setTimeout(() => {
      setHasStarted(true);
      let startTime: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOutCubic * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay, hasStarted]);

  return count;
};

const Stats: React.FC = () => {
  const api = {
    // baseUrl: "http://lokalinomlud.altervista.org/be/stats",
    baseUrl: "/be/stats",

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
      setTotalNumberOfBooks(
        data.reduce((sum, item) => sum + item.books_cnt, 0)
      );
    },

    async fetchSalesPerDay(): Promise<void> {
      const response = await fetch(`${this.baseUrl}/getSalesPerDay.php`);
      if (!response.ok) throw new Error("Failed to fetch sales per day");
      const data = (await response.json()).map((item: any) => ({
        date: item.date_sale,
        books_sold_that_day: Number(item.num_buyers),
        day_money: Number(item.day_money),
      })) as SalesPerDay[];
      setSalesPerDay(data);
      setNumBuyers(data.reduce((sum, item) => sum + item.books_sold_that_day, 0));
    },
  };

  const navigate = useNavigate();
  const [numHischools, setNumHighSchools] = useState<number>(-1);
  const [numMediumSchools, setNumMediumSchools] = useState<number>(-1);
  const [totalMoneyMovement, setTotalMoneyMovement] = useState<number>(-1);
  const [numNewMailSubscribers, setNumNewMailSubscribers] =
    useState<number>(-1);
  const [booksPerSchool, setBooksPerSchool] = useState<BooksPerSchool[]>([]);
  const [totalNumberOfBooks, setTotalNumberOfBooks] = useState<number>(-1);
  const [salesPerDay, setSalesPerDay] = useState<SalesPerDay[]>([]);
  const [numBuyers, setNumBuyers] = useState<number>(-1);

  useEffect(() => {
    api.fetchHighSchoolRatio();
    api.fetchTotalMoneyMovement();
    api.fetchNumNewMailSubscribers();
    api.fetchBooksPerSchool();
    api.fetchSalesPerDay();
  }, []);

  const [colors, setColors] = useState<string[]>([]);

  // Animated counters
  const animatedTotalNumberOfBooks = useCountAnimation(
    totalNumberOfBooks > 0 ? totalNumberOfBooks : 0,
    2000,
    0
  );
  const animatedTotalMoney = useCountAnimation(
    totalMoneyMovement > 0 ? totalMoneyMovement : 0,
    2500,
    0
  );
  const animatedSavingsPerPerson = useCountAnimation(
    totalMoneyMovement > 0 && numHischools + numMediumSchools > 0
      ? totalMoneyMovement / (2 * numBuyers)
      : 0,
    2000,
    0
  );
  const animatedMailSubscribers = useCountAnimation(
    numNewMailSubscribers > 0 ? numNewMailSubscribers : 0,
    1500,
    0
  );
  const animatedNumberOfBooksPerDay = useCountAnimation(
    totalNumberOfBooks > 0 ? Math.floor(totalNumberOfBooks / 14) : 0, // 14: number of days for pickUp Books
    2000,
    0
  );

  useEffect(() => {
    if (colors.length < animatedTotalNumberOfBooks) {
      const newColors = [...colors];
      for (let i = colors.length; i < animatedTotalNumberOfBooks; i++) {
        newColors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
      }
      setColors(newColors);
    }
  }, [animatedTotalNumberOfBooks, colors]);

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
        <p>E' stato ritirato un numero di libri pari a</p>
        <p className="big-number">{animatedTotalNumberOfBooks}</p>
        <p>
          Sono arrivati proprio a palate, anzi, a camionate! Qui possiamo
          osservare il tir che li ha portati che, dopo tanto lavoro, si sta
          finalmente riposando
        </p>
        <div className="book-animation-container">
          <div className="book-animation">
            <FaTruckMoving style={{ fontSize: "80px", color: "#000" }} />
          </div>
        </div>
        {/* <style>
          {`
            .book-animation-container {
              position: relative;
              width: 100%;
              height: 50px;
              overflow: hidden;
              margin: 20px 0;
            }

            .book-animation {
              position: absolute;
              animation: moveBook 8s linear infinite;
            }

            @keyframes moveBook {
              0% {
          left: -50px;
              }
              100% {
          left: 100%;
              }
            }
          `}
        </style>
        <p>
          Per farti capire quanti effettivamente siano {totalNumberOfBooks}{" "}
          libri, ecco qui un libro per ogni libro ritirato:
        </p>
        {Array.from({ length: animatedTotalNumberOfBooks }, (_, index) => {
          return (
            <FaBook
              key={index}
              style={{
                margin: "5px",
                fontSize: "20px",
                color: colors[index] || "#000",
              }}
            />
          );
        })} */}
        <p>In media, ogni giorno è stato ritirato un numero di libri pari a</p>
        <p className="big-number">{animatedNumberOfBooksPerDay}</p>
        <h2>$ Money money money $</h2>
        <p>Totale soldi che sono passati tramite il mlu:</p>
        <p className="big-number">{animatedTotalMoney}€</p>
        {/* <p>
          Ogni persona si stima che sia riuscita a risparmiare sull'acquisto di
          libri una cifra di
        </p>
        <p className="big-number">{animatedSavingsPerPerson.toFixed(2)}€</p> */}
        {/* <p className="side-note">
          Questa cifra è stata ricavata assumendo che le persone che hanno
          venduto libri siano state tutte persone che hanno poi comprato libri.
          Il numero di coloro che hanno portato dei libri ma non li hanno
          comprati è stato bilanciato con coloro che hanno comprato libri ma non
          li hanno portati.
        </p> */}
        <p>Segue una tabella in cui sono riportati i dati di vendita per giorno:</p>
        <table className="books-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Numero di libri venduti</th>
              <th>Totale incassato</th>
            </tr>
          </thead>
          <tbody>
            {salesPerDay.map((sale) => (
              <tr key={sale.date}>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>{sale.books_sold_that_day}</td>
                <td style={{ textAlign: "right" }}>
                  {sale.day_money.toFixed(2)}€
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Mail list</h2>
        <p>Il numero di nuovi iscritti alla mail list è:</p>
        <p className="big-number">{animatedMailSubscribers}</p>
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
        <p>Numero di libri ritirati dal mlu per ogni scuola</p>
        <BarChart
          yAxis={[
            { width: 300, data: booksPerSchool.map((item) => item.Name) },
          ]}
          series={[{ data: booksPerSchool.map((item) => item.books_cnt) }]}
          layout="horizontal"
          height={500}
        />
      </div>
    </div>
  );
};

export default Stats;
