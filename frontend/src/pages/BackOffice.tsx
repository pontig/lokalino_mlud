import React from "react";
import { HashRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

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
    { choice: "Insert book in the system", url: "/insertBooks" },
    { choice: "Sell books", url: "/sell" },
    { choice: "Pick up books (WIP)", url: "/pickUp" },
    { choice: "Liquidate a seller (WIP)", url: "/liquidate" },
    { choice: "Provider: insert books", url: "/bookSubmission" },
    { choice: "admin: insert books as cool kids (WIP)", url: "/admin" },
];

const BackOffice: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="backOffice">
            <h1>Back Office</h1>
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
                        {option.choice}
                    </div>
                );
            })}
        </div>
    );
};
export default BackOffice;
