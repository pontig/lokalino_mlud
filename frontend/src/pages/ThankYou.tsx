// ThankYouPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";

import "../styles/ThankYou.css";

const ThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  return (
    <div>
      <h1>Thank You, {name}!</h1>
      <p>Your books have been successfully submitted.</p>
    </div>
  );
};

export default ThankYouPage;
