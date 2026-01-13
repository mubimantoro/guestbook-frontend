import React, { useState, useRef, useEffect } from "react";

export default function ExportDropdown({
  onExportData,
  onExportIndeks,
  loading,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn btn-success"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Exporting...
          </>
        ) : (
          <>
            <i className="bx bx-download me-2"></i>
            Export Excel
            <i className="bx bx-chevron-down ms-2"></i>
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="dropdown-menu dropdown-menu-end show"
          style={{ position: "absolute" }}
        >
          <h6 className="dropdown-header">Pilih Jenis Export</h6>
          <button
            className="dropdown-item"
            onClick={() => {
              onExportData();
              setIsOpen(false);
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="me-3"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "#4472C4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="bx bx-user text-white"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </div>
              <div>
                <div className="fw-bold">Data Pengunjung</div>
                <small className="text-muted">
                  Semua data tamu & kunjungan
                </small>
              </div>
            </div>
          </button>
          <div className="dropdown-divider"></div>
          <button
            className="dropdown-item"
            onClick={() => {
              onExportIndeks();
              setIsOpen(false);
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="me-3"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "#00B050",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="bx bx-bar-chart text-white"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </div>
              <div>
                <div className="fw-bold">Indeks Kepuasan</div>
                <small className="text-muted">
                  Data rating & feedback tamu
                </small>
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
