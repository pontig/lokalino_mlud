import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  FaBook,
  FaDollarSign,
  FaTruck,
  FaMoneyCheckAlt,
  FaBookOpen,
  FaUserShield,
} from "react-icons/fa";
import { CgInsertAfterO } from "react-icons/cg";
import { GiReceiveMoney } from "react-icons/gi";
import { IoMailOutline } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";

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

const options = [
  {
    choice: "Insert book in the system",
    url: "/insertBooks",
    icon: <CgInsertAfterO />,
    status: "OK",
  },
  { choice: "Sell books", url: "/sell", icon: <FaDollarSign />, status: "OK" },
  {
    choice: "Pick up books",
    url: "/pickUp",
    icon: <GiReceiveMoney />,
    status: "OK",
  },
  {
    choice: "Liquidate a seller ",
    url: "/liquidate",
    icon: <FaMoneyCheckAlt />,
    status: "OK",
  },
  {
    choice: "Provider: insert books",
    url: "/",
    icon: <FaBookOpen />,
    status: "OK",
  },
  {
    choice: "admin: insert books as cool kids ",
    url: "/admin",
    icon: <FaUserShield />,
    status: "not yet started",
  },
  {
    choice: "Show mailing list subscribers ",
    url: "/mailingList",
    icon: <IoMailOutline />,
    status: "OK",
  },
  {
    choice: "Show statistics",
    url: "/statistics",
    icon: <MdQueryStats />,
    status: "not yet started",
  },
  {
    choice: "Logout",
    url: null,
    icon: <IoIosLogOut />,
    status: "OK",
  },
];

const BackOffice: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/be/utils/session.php").then((response) => {
      if (response.status === 401) {
        navigate("/login");
      }
    });
  }, []);

  return (
    <div className="bookstore-container">
      <h1 style={{ textAlign: "center" }}>Back Office</h1>
      <div className="content">
        {options.map((option, index) => {
          const backgroundColor = getGradientColor(index, options.length);
          const color = getFontColor(backgroundColor);
          return (
            <div
              key={index}
              style={{ backgroundColor, color }}
              className="choice"
              onClick={() => {
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
              }}
            >
              <div style={{ fontSize: "2em" }}>{option.icon}</div>
              {option.choice}
              <i style={{ fontSize: "small" }}>{option.status}</i>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BackOffice;
