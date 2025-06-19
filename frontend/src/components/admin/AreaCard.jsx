import React from "react";

const AreaCard = ({ name }) => (
  <div
    style={{
      background: "#f7f7f7",
      borderRadius: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      padding: "32px 24px",
      minWidth: "200px",
      minHeight: "90px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 500,
      fontSize: "18px",
      color: "#222",
      flex: "1 1 0",
      textAlign: "center",
    }}
  >
    {name}
  </div>
);

export default AreaCard;