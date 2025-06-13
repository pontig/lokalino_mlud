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
      <p className="ty-p">Ti aspettiamo {period} al lokalino!</p>
    </div>
  );
};

export default ThankYouPage;
