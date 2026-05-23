import React from "react";
import { FaUser } from "react-icons/fa";


const ProviderMicroLogo: React.FC<{ providerId: number | String; name: String; surname: String, inline?: boolean }> = ({ providerId, name, surname, inline = true }) => {

    const className = inline ? "inline-provider" : "bigger-provider"

    return (
        <span 
            className={className}
            style={{
                background: "#aadeff",
                padding: "4px",
                borderRadius: "0.375rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",

            }}>
            <FaUser />
            <b>(ID#{providerId})</b>
            <span>
                {name} {surname}
            </span>
        </span>
    )
}

export default ProviderMicroLogo