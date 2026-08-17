import React from "react";

export default function UserNotRegisteredError() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a", color: "#ffffff", padding: "1.5rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Account Not Found</h1>
      <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
        Your account is not registered. Please contact an administrator or sign up.
      </p>
    </div>
  );
}
