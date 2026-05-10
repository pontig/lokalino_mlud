import React from "react";
import { FaUser } from "react-icons/fa";


const ProviderMicroLogo: React.FC<{ providerId: number | String; name: String; surname: String }> = ({ providerId, name, surname }) => {
    return (
        <span style={{ background: "#aadeff", padding: "4px", borderRadius: "0.375rem" }}><FaUser /> <b>(ID#{providerId})</b> {name} {surname}</span>
    )
}

export default ProviderMicroLogo