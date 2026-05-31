import React from "react";

interface headerProps {
    title: String;
    hasSearchBox: boolean;
    hasBackButton ?: boolean;
    value ?: string | "";
    onPassedChange ?: (searchTerm: string) => void;
    onLinkClick: () => void;
}

const Header: React.FC<headerProps> = ({ title, hasSearchBox, hasBackButton = true, value = "", onPassedChange = () => {}, onLinkClick = () => {} }) => {
    return (<div>
        <h1 style={{textAlign: "center"}}>{title}</h1>
        <div className="search-container">

        {hasBackButton ? (
            <p onClick={onLinkClick} className="back-button">
                ← Indietro
            </p>
        ) : <span></span>}
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