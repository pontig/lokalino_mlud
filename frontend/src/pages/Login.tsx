import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  // API service
  const api = {
    baseUrl: "/be",

    async login(): Promise<void> {
      const response = await fetch(`${api.baseUrl}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          submit: true,
        }),
      });

      if (response.ok) {
        // Change page title
        document.title = "MLUD - Dashboard";
        navigator("/backOffice");
      } else {
        alert("Failed to login");
      }
    },
  };

  // Navigation and state
  const navigator = useNavigate();
  const [password, setPassword] = useState("");

  // Functions
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      api.login();
    }
  };

  return (
    <div className="thank-you">
      <h1 className="ty-h1">Login al nuovo merkatino libri usati digitale</h1>
      <input
        type="password"
        className="password-field-input"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ width: "20vw" }}
      />
      <button
        className="submit-button"
        style={{ width: "10vw", marginTop: "2vh" }}
        onClick={api.login}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
