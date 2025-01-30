import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigator = useNavigate();
  const [password, setPassword] = useState("");

  const hashPassword = async (password: string) => {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const api = {
    baseUrl: "/be",

    async login() {
      const response = await fetch(`${api.baseUrl}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: await hashPassword(password),
          submit: true,
        }),
      });

      if (response.ok) {
        navigator("/backOffice");
      } else {
        alert("Failed to login");
      }
    },
  };

  return (
    <div className="thank-you">
      <h1 className="ty-h1">Login to lokalino mlud</h1>
      <input
        type="password"
        className="password-field-input"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
