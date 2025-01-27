import React from "react";
import { HashRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { FaBook, FaDollarSign, FaTruck, FaMoneyCheckAlt, FaBookOpen, FaUserShield } from "react-icons/fa";
import { CgInsertAfterO } from "react-icons/cg";
import { GiReceiveMoney } from "react-icons/gi";

import "../styles/BackOffice.css";


const getGradientColor = (index: number, total: number) => {
    const startColor = [0,100,0]; 
    const endColor = [59,130,246]; 
    const ratio = index / (total - 1);
    const color = startColor.map((start, i) => Math.round(start + ratio * (endColor[i] - start)));
    return `rgb(${color.join(",")})`;
};

const getFontColor = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? "black" : "white";
};


const options = [
    { choice: "Insert book in the system", url: "/insertBooks", icon: <CgInsertAfterO  /> },
    { choice: "Sell books", url: "/sell", icon: <FaDollarSign /> },
    { choice: "Pick up books", url: "/pickUp", icon: <GiReceiveMoney  /> },
    { choice: "Liquidate a seller (WIP)", url: "/liquidate", icon: <FaMoneyCheckAlt /> },
    { choice: "Provider: insert books", url: "/bookSubmission", icon: <FaBookOpen /> },
    { choice: "admin: insert books as cool kids (WIP)", url: "/admin", icon: <FaUserShield /> },
];

const BackOffice: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="bookstore-container">
            <h1 style={{textAlign: "center"}}>Back Office</h1>
            <div className="content">

            {options.map((option, index) => {
                const backgroundColor = getGradientColor(index, options.length);
                const color = getFontColor(backgroundColor);
                return (
                    <div
                    key={index}
                    style={{ backgroundColor, color }}
                    className="choice"
                    onClick={() => navigate(option.url)}
                    >
                    <div style={{ fontSize: "2em" }}>{option.icon}</div>
                    {/* <br /> */}
                        {option.choice}
                    </div>
                );
            })}
            </div>
        </div>
    );
};
export default BackOffice;
