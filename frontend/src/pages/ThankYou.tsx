// ThankYouPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";

const ThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  return (
    <div className="thank-you">
      <h1 className="ty-h1">Thank You, {name}!</h1>
      <p className="ty-p">Your books have been successfully submitted.</p>
    </div>
  );
};

export default ThankYouPage;
