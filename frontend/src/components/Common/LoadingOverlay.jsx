import { Spinner } from "react-bootstrap";

export default function LoadingOverlay({ 
  loading = false, 
  error = false, 
  message = null,
  size = "normal" 
}) {
  if (!loading && !error) return null;

  const spinnerSize = size === "large" ? { width: 60, height: 60 } : {};

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(255,255,255,0.6)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 20
    }}>
      <Spinner 
        animation="border" 
        variant={error ? "danger" : "primary"} 
        style={spinnerSize} 
      />
      {message && (
        <div style={{
          background: "white",
          padding: "10px 15px",
          borderRadius: 15,
          border: `2px solid ${error ? "#dc3545" : "#007bff"}`,
          position: "relative",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            position: "absolute",
            bottom: -8,
            left: 30,
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: `8px solid ${error ? "#dc3545" : "#007bff"}`
          }}></div>
          <span style={{ color: error ? "#dc3545" : "#007bff", fontWeight: "500" }}>
            {message}
          </span>
        </div>
      )}
    </div>
  );
}
