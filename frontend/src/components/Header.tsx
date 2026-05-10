import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface headerProps {
    title: String;
    hasSearchBox: boolean;
    value ?: string | "";
    onPassedChange ?: (searchTerm: string) => void;
    onLinkClick: () => void;
}

const Header: React.FC<headerProps> = ({ title, hasSearchBox, value = "", onPassedChange = () => {}, onLinkClick = () => {} }) => {
    return (<div>
        <h1 style={{textAlign: "center"}}>{title}</h1>
        <div className="search-container">

        <p onClick={onLinkClick} className="back-button">
            ← Pannello di controllo
        </p>
        {hasSearchBox && (
            <input
            type="text"
            placeholder="🔍 Cerca in questa lista..."
            className="search-input"
            value={value}
            onChange={(e) => onPassedChange(e.target.value)}
            />
        )}
        </div>
    </div>)
}

export default Header;