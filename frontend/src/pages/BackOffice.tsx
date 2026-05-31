import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaMoneyCheckAlt,
  FaDatabase,
  FaBookOpen,
  FaUserShield,
  FaListUl
} from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { IoMailOutline } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { SiBookstack } from "react-icons/si";
import { AiFillSchedule } from "react-icons/ai";
import DashboardEntry from "../components/DashboardEntry";
import Schedule from "./Schedule";
import PeriodEmails from "./PeriodEmails";

const BackOffice: React.FC = () => {
  // Navigation and state
  const navigate = useNavigate();
  const [showGraphAffluences, setShowGraphAffluences] = useState(true);

  // Effects
  useEffect(() => {
    fetch("/be/utils/session.php").then((response) => {
      if (response.status === 401) {
        navigate("/login");
      }
    });
  }, []);

  // Functions
  const getGradientColor = (index: number, total: number) => {
    const startColor = [0, 100, 0];
    const endColor = [59, 130, 246];
    const ratio = index / (total - 1);
    const color = startColor.map((start, i) =>
      Math.round(start + ratio * (endColor[i] - start))
    );
    return `rgb(${color.join(",")})`;
  };

  const getFontColor = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? "black" : "white";
  };

  const options: {
    choice: string;
    url: string | null;
    icon: React.ReactNode;
    status: string;
    permission: 0 | 1;
  }[] = [
      {
        choice: "Previsione consegne",
        url: "/schedule",
        icon: <AiFillSchedule />,
        status: "OK",
        permission: 1,
      },
      {
        choice: "Vendita libri",
        url: "/sell",
        icon: <FaDollarSign />,
        status: "OK",
        permission: 1,
      },
      {
        choice: "Ritiro libri da vendere",
        url: "/pickUp",
        icon: <GiReceiveMoney />,
        status: "OK",
        permission: 1,
      },
      {
        choice: "Liquidazione libri invenduti",
        url: "/liquidate",
        icon: <FaMoneyCheckAlt />,
        status: "OK",
        permission: 1,
      },
      {
        choice: "Registrazione venditori",
        url: "/",
        icon: <FaBookOpen />,
        status: "OK",
        permission: 1,
      },
      {
        choice: "Visualizza affluenze nominali",
        url: "/periodemail",
        icon: <FaListUl />,
        status: "OK",
        permission: 1,
      },
      {
        choice: "admin: inserisci listone di libri",
        url: "/admin",
        icon: <FaUserShield />,
        status: "OK",
        permission: 1,
      },
      {
        choice: "Mailing list",
        url: "/mailingList",
        icon: <IoMailOutline />,
        status: "OK",
        permission: 1,
      },
      {
        choice: "Statistiche",
        url: "/stats",
        icon: <MdQueryStats />,
        status: "Work in Progress",
        permission: 1,
      },
      {
        choice: "admin: backup database",
        url: "/backupDatabase",
        icon: <FaDatabase />,
        status: "OK",
        permission: 1,
      },
      {
        choice: "Logout",
        url: null,
        icon: <IoIosLogOut />,
        status: "OK",
        permission: 1,
      },
    ];

  return (
    <div className="bookstore-container" style={{ width: "100%", maxWidth: "initial", padding: 0 }}>
      <h1 style={{ textAlign: "center" }}>MLUD dashboard</h1>
      {/* <div className="content">
        {options.map((option, index) => {
          const isDisabled = option.permission === 0;
          const backgroundColor = isDisabled
            ? "#ccc"
            : getGradientColor(index, options.length);
          const color = isDisabled ? "#666" : getFontColor(backgroundColor);
          return (
            <div
              key={index}
              style={{
                backgroundColor,
                color,
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.6 : 1,
                pointerEvents: isDisabled ? "none" : "auto",
              }}
              className="choice"
              onClick={() => {
                if (!isDisabled) {
                  if (option.url) {
                    navigate(option.url);
                  } else {
                    fetch("/be/utils/session.php?logout=true").then(
                      (response) => {
                        if (response.status === 401) {
                          navigate("/login");
                        }
                      }
                    );
                  }
                }
              }}
            >
              <div style={{ fontSize: "2em" }}>{option.icon}</div>
              {option.choice}
              <i style={{ fontSize: "small" }}>{option.status}</i>
            </div>
          );
        })}
      </div> */}
      <div className="content-new">
        <div className="header">
          <p className="back-button"
            style={{ textAlign: "right", fontSize: "1.2rem" }}
            onClick={() => {
              fetch("/be/utils/session.php?logout=true").then(
                (response) => {
                  if (response.status === 401) {
                    navigate("/login");
                  }
                }
              );
            }}
          >Logout</p>
        </div>
        <div className="menu">
          <b>Azioni quotidiane</b>
          <DashboardEntry title="Ritiro libri da vendere" icon={<GiReceiveMoney />} url="/pickUp" backgroundColor={"rgb(0,100,0)"} />
          <DashboardEntry title="Vendi libri" icon={<FaDollarSign />} url="/sell" backgroundColor={"rgb(0,100,0)"} />
          <DashboardEntry title="Liquidazione" icon={<FaMoneyCheckAlt />} url="/liquidate" backgroundColor={"rgb(0,100,0)"} />
          <DashboardEntry title="Lista libri" icon={<SiBookstack />} url="/booklist-audience" backgroundColor={"rgb(0,100,0)"} />
          <b>Area pericolosa</b>
          <DashboardEntry title="Inserisci listone di libri" icon={<FaUserShield />} url="/admin" backgroundColor={"rgb(35, 118, 148)"} />
          <DashboardEntry title="Backup database" icon={<FaDatabase />} url="/backupDatabase" backgroundColor={"rgb(35, 118, 148)"} />
          <DashboardEntry title="Iscritti mailing list" icon={<IoMailOutline />} url="/mailingList" backgroundColor={"rgb(35, 118, 148)"} />
          <b>Adios muchachos</b>
          <DashboardEntry title="Logout" icon={<IoIosLogOut />} url="xx" backgroundColor={"rgb(225, 0, 0)"} />
        </div>
        <div className="backoffice-content" style={{fontSize: "1.2rem"}}>
          <h3>Previsione affluenze</h3>
          <p style={{color: "#666", cursor: "pointer"}} onClick={() => setShowGraphAffluences(!showGraphAffluences)}>
            {showGraphAffluences ? "Vedi nomi" : "Vedi panoramica"}
          </p>
          {showGraphAffluences ? <Schedule /> : <PeriodEmails />}
          <div style={{ maxWidth: "33%", margin: ".5rem auto" }}>
            <DashboardEntry title="Vedi tutte le statistiche" icon={<MdQueryStats />} url="/stats" backgroundColor={"rgb(59, 130, 246)"} />
            <DashboardEntry title="Form per i venditori" icon={<FaBookOpen />} url="/" backgroundColor={"rgb(59, 130, 246)"} />
          </div>
        </div>
        {/* <div className="footer">footer</div> */}
      </div>
    </div>
  );
};
export default BackOffice;
