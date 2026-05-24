import React from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const DashboardEntry: React.FC<{
    title: string,
    icon: React.ReactNode,
    url: string,
    backgroundColor: string
}>
    = ({ title, icon, url, backgroundColor }) => {

        const navigate = useNavigate();

        return (
            <div
                style={{
                    background: backgroundColor,
                    color: "white",
                    padding: "4px",
                    borderRadius: "0.375rem",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    cursor: "pointer",
                    margin: "0.3rem",
                    transition: "all 0.2s ease",
                    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)"
                }}
                onClick={() => {
                    if (url !== "xx") {
                        navigate(url);
                    } else {
                        fetch("/be/utils/session.php?logout=true").then(
                            (response) => {
                                if (response.status === 401) {
                                    navigate("/login");
                                }
                            }
                        );
                    }
                }}
                onMouseEnter={(e) => e.currentTarget.style.margin = "0.1rem"}
                onMouseLeave={(e) => e.currentTarget.style.margin = "0.3rem"}
            >
                {icon}
                <p>{title}</p>
                {/* <span>{url}</span> */}
            </div>
        )
    }

export default DashboardEntry