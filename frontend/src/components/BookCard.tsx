import React from "react";
import ProviderMicroLogo from "./Provider_MicroLogo";

interface bookEntry {
    ISBN?: string;
    Title?: string;
    Author?: string;
    Editor?: string;
    Price_new?: number;
    Comment?: string;
    PB_Id?: number;
    ProviderName?: string;
    ProviderSurname?: string;
    Provider_Id?: number | string;
    Dec_conditions?: string;

    Button?: React.FC;
}

const BookCard: React.FC<bookEntry> = ({ ISBN, Title, Author, Editor, Price_new, Comment, PB_Id, ProviderName, ProviderSurname, Provider_Id, Dec_conditions, Button }) => {

    return <div key={PB_Id} className="book-card">
        <div className="book-content">
            {Title && <h3 className="book-title">{Title}</h3>}
            {Author && <p className="book-author">di {Author}</p>}
            {ISBN && <p className="book-author">isbn {ISBN}</p>}
            {Editor && <p className="book-description">Editore: {Editor}</p>}
            {ProviderName && ProviderSurname && Provider_Id && (
                <p className="book-description">
                    Venduto da <ProviderMicroLogo providerId={Provider_Id} name={ProviderName} surname={ProviderSurname} />,
                </p>
            )}
            {Dec_conditions && Dec_conditions != null && (
                <p className="book-description">Stato: {Dec_conditions}</p>
            )}
            {Comment && Comment != null && Comment !== "null" && (
                <p className="book-description">Commento: {Comment}</p>
            )}
            <div className="book-footer">
                <span className="book-price">
                    €{Number(Price_new).toFixed(2)}
                </span>
                {Button && <Button />}
            </div>
        </div>
    </div>
}

export default BookCard