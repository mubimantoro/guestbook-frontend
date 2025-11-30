import React from "react";

export default function Loading() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "300px" }}
    >
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="text-muted">Memuat data...</div>
    </div>
  );
}
