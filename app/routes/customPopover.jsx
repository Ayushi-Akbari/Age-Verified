import React from "react";

export default function CustomPopover({ active, onClose, activator, children, width = 900, height = 600 }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {activator}
      {active && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: "0",
            minWidth: width,
            width: width,
            minHeight: height,
            height: height,
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>×</button>
          </div>
          <div style={{ padding: 24 }}>{children}</div>
        </div>
      )}
    </div>
  );
}