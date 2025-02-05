// ThankYouPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";

const ThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  return (
    <div className="thank-you">
      <h1 className="ty-h1">Grazie, {name}!</h1>
      <p className="ty-p">Puoi venire a consegnare questi libri dal.. al..</p>
    </div>
  );
};

export default ThankYouPage;
