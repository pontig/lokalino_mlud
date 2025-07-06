import React, { useEffect } from "react";
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
import { AiFillSchedule } from "react-icons/ai";

const BackOffice: React.FC = () => {
  // Navigation and state
  const navigate = useNavigate();

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
      permission: 0,
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
    <div className="bookstore-container">
      <h1 style={{ textAlign: "center" }}>MLUD dashboard</h1>
      <div className="content">
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
              {/* <i style={{ fontSize: "small" }}>{option.status}</i> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BackOffice;
