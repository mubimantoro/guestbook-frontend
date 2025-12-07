import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TamuSuccess() {
  document.title = "Pendaftaran Berhasil - Buku Tamu Digital KGTK Gorontalo";

  const navigate = useNavigate();
  const location = useLocation();
  const tamuData = location.state?.tamuData;

  useEffect(() => {
    if (!tamuData) {
      navigate("/");
    }
  }, [tamuData, navigate]);

  const handleBackToForm = () => {
    navigate("/", { replace: true });
  };

  if (!tamuData) {
    return null;
  }

  return (
    <div className="page">
      <header
        className="navbar navbar-expand-md navbar-light d-print-none"
        style={{ borderBottom: "1px solid #e6e7e9" }}
      >
        <div className="container-xl">
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a
              href="https://kgtkgorontalo.kemendikdasmen.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "1.2rem", fontWeight: 600, color: "#1e293b" }}
            >
              Buku Tamu KGTK Gorontalo
            </a>
          </h1>
          <div className="navbar-nav flex-row order-md-last">
            <a
              href="https://kgtkgorontalo.kemendikdasmen.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-secondary"
            >
              <i className="bx bx-home me-2"></i>
              Website Utama
            </a>
          </div>
        </div>
      </header>

      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-body">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-7">
                <div className="text-center mb-4">
                  <div className="mb-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success text-white"
                      style={{
                        width: "120px",
                        height: "120px",
                        animation: "scaleIn 0.5s ease-out",
                      }}
                    >
                      <i
                        className="bx bx-check"
                        style={{ fontSize: "4rem" }}
                      ></i>
                    </div>
                  </div>
                  <h2 className="mb-3">Pendaftaran Berhasil!</h2>
                  <p className="text-muted mb-0">
                    Terima kasih telah mendaftar. Data kunjungan Anda telah
                    berhasil disimpan dalam sistem.
                  </p>
                </div>

                <div className="card rounded-3 mb-4 border-success">
                  <div className="card-body text-center py-4">
                    <div className="text-muted small mb-2">
                      ID Kunjungan Anda
                    </div>
                    <h1
                      className="mb-3 text-success"
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {tamuData.kode_kunjungan}
                    </h1>
                  </div>
                </div>

                <div className="card rounded-3 mb-4">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Detail Kunjungan</h3>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="text-muted small mb-1">
                          Nama Lengkap
                        </div>
                        <div className="fw-bold">{tamuData.nama_lengkap}</div>
                      </div>
                      <div className="col-md-6">
                        <div className="text-muted small mb-1">
                          Nomor WhatsApp
                        </div>
                        <div className="fw-bold">{tamuData.nomor_hp}</div>
                      </div>
                      <div className="col-md-6">
                        <div className="text-muted small mb-1">
                          Asal Instansi
                        </div>
                        <div className="fw-bold">{tamuData.instansi}</div>
                      </div>
                      <div className="col-md-6">
                        <div className="text-muted small mb-1">
                          Tanggal Kunjungan
                        </div>
                        <div className="fw-bold">
                          {new Date(
                            tamuData.tanggal_kunjungan
                          ).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="text-muted small mb-1">
                          Tujuan Kunjungan
                        </div>
                        <div className="fw-bold">
                          {tamuData.kategori_kunjungan?.nama || "-"}
                        </div>
                      </div>
                      {tamuData.catatan && (
                        <div className="col-md-12">
                          <div className="text-muted small mb-1">
                            Keperluan/Detail Kunjungan
                          </div>
                          <div className="fw-bold">{tamuData.catatan}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-print-none mb-4">
                  <button
                    onClick={handleBackToForm}
                    className="btn btn-primary w-100"
                    style={{ padding: "0.75rem 1.5rem" }}
                  >
                    <i className="bx bx-home me-2"></i>
                    Kembali ke Beranda
                  </button>
                </div>

                <div className="d-none d-print-block">
                  <div className="card">
                    <div className="card-body text-center">
                      <p className="mb-0">
                        Dicetak pada:{" "}
                        {new Date().toLocaleString("id-ID", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer footer-transparent d-print-none mt-4">
        <div className="container-xl">
          <div className="row text-center">
            <div className="col-12">
              <div className="text-muted">
                © 2025 Buku Tamu KGTK Gorontalo. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media print {
          .navbar,
          .footer,
          .btn,
          .d-print-none {
            display: none !important;
          }
          
          .card {
            page-break-inside: avoid;
            border: 1px solid #dee2e6 !important;
          }
        }
      `}</style>
    </div>
  );
}
