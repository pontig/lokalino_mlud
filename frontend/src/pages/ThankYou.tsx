// ThankYouPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";

const ThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const period = searchParams.get("period");

  return (
    <div className="thank-you">
      <h1 className="ty-h1">Grazie, {name}!</h1>
      <p className="ty-p">Ti aspettiamo il giorno {period} al lokalino!</p>
      <p>Se dovessi, cambiare idea, i libri vengono ritirati dall'1 al 18 luglio con i seguenti orari di apertura:</p>
      <ul>
        <li><b>Lunedì:</b> 14.30-17.30</li>
        <li><b>Martedì:</b> 9.30-12.00</li>
        <li><b>Mercoledì:</b> 14.30-17.30</li>
        <li><b>Giovedì:</b> 9.30-12.00</li>
        <li><b>Venerdì:</b> 14.30-17.30</li>
        </ul>
    </div>
  );
};

export default ThankYouPage;
