import React from "react";

export default function AlertDataEmpty() {
  return (
    <div className="alert alert-danger rounded" role="alert">
      <div className="d-flex">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon alert-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div>
          <h4 className="alert-title">Data Belum Tersedia!</h4>
          <div className="text-muted">
            Belum ada data yang dapat ditampilkan saat ini.
          </div>
        </div>
      </div>
    </div>
  );
}
