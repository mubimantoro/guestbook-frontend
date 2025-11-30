import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../../services/Api";
import toast from "react-hot-toast";

export default function PenilaianWeb() {
  document.title = "Penilaian Kepuasan - Buku Tamu Digital";

  const { kode_kunjungan } = useParams();
  const navigate = useNavigate();

  const [tamu, setTamu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [keterangan, setKeterangan] = useState("");

  // Fetch data kunjungan
  const fetchData = async () => {
    await Api.get(`/api/public/penilaian/${kode_kunjungan}`).then(
      (response) => {
        setTamu(response.data.data);
      }
    );
  };

  useEffect(() => {
    fetchData();
  }, [kode_kunjungan]);

  // Submit penilaian
  const handleSubmit = async (e) => {
    e.preventDefault();

    await Api.post(`/api/public/penilaian/${kode_kunjungan}`, {
      rating: rating,
      keterangan: keterangan,
    }).then((response) => {
      toast.success(response.data.message, {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    });
  };

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Star rating descriptions
  const ratingDescriptions = {
    1: "Sangat Tidak Puas",
    2: "Tidak Puas",
    3: "Cukup Puas",
    4: "Puas",
    5: "Sangat Puas",
  };

  // Already submitted state
  if (isSubmitted) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="mb-4">
                    <div
                      className="avatar avatar-xl bg-success-lt rounded-circle mx-auto"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i
                        className="bx bx-check"
                        style={{ fontSize: "48px", lineHeight: "80px" }}
                      ></i>
                    </div>
                  </div>
                  <h2 className="mb-3">Terima Kasih!</h2>
                  <p className="text-muted mb-4">
                    {tamu?.penilaian
                      ? "Anda sudah memberikan penilaian sebelumnya."
                      : "Penilaian Anda telah berhasil dikirim."}
                  </p>
                  {tamu?.penilaian && (
                    <div className="alert alert-info">
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">Rating Anda:</strong>
                        <div className="text-warning">
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`bx ${
                                index < tamu.penilaian.rating
                                  ? "bxs-star"
                                  : "bx-star"
                              }`}
                              style={{ fontSize: "20px" }}
                            ></i>
                          ))}
                        </div>
                      </div>
                      {tamu.penilaian.keterangan && (
                        <p className="mb-0 small">
                          "{tamu.penilaian.keterangan}"
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-muted small">
                    Kami sangat menghargai feedback Anda untuk meningkatkan
                    pelayanan kami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not eligible for rating (status not "bertemu")
  if (tamu && tamu.status !== "Disetujui") {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="mb-4">
                    <div
                      className="avatar avatar-xl bg-warning-lt rounded-circle mx-auto"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i
                        className="bx bx-info-circle"
                        style={{ fontSize: "48px", lineHeight: "80px" }}
                      ></i>
                    </div>
                  </div>
                  <h2 className="mb-3">Penilaian Belum Tersedia</h2>
                  <p className="text-muted mb-4">
                    Penilaian hanya dapat diberikan setelah pertemuan
                    terlaksana.
                  </p>
                  <div className="alert alert-warning text-start">
                    <strong>Status Kunjungan Anda:</strong> {tamu.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold mb-2">Penilaian Kepuasan</h1>
              <p className="text-muted">
                Bantu kami meningkatkan pelayanan dengan memberikan penilaian
                Anda
              </p>
            </div>

            {/* Informasi Kunjungan */}
            <div className="card  shadow-sm mb-4">
              <div className="card-status-top bg-primary"></div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="small text-muted mb-1">Nama Tamu</div>
                    <div className="fw-bold">{tamu?.nama_lengkap}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="small text-muted mb-1">Instansi</div>
                    <div className="fw-bold">{tamu?.instansi}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="small text-muted mb-1">
                      Kategori Kunjungan
                    </div>
                    <div className="fw-bold">
                      {tamu?.kategori_kunjungan?.nama}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="small text-muted mb-1">Waktu Bertemu</div>
                    <div className="fw-bold">
                      {tamu?.waktu_temu ? formatDate(tamu.waktu_temu) : "-"}
                    </div>
                  </div>
                  {tamu?.pic?.user && (
                    <div className="col-12">
                      <div className="small text-muted mb-1">Dilayani oleh</div>
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm me-2">
                          {tamu.pic.user.nama_lengkap.charAt(0).toUpperCase()}
                        </span>
                        <div className="fw-bold">
                          {tamu.pic.user.nama_lengkap}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Penilaian */}
            <div className="card shadow-sm">
              <div className="card-status-top bg-primary"></div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Star Rating */}
                  <div className="mb-4 text-center">
                    <label className="form-label d-block mb-3">
                      <strong>Bagaimana pengalaman Anda?</strong>
                      <span className="text-danger">*</span>
                    </label>
                    <div className="mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="btn btn-link p-1"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          style={{ fontSize: "3rem", textDecoration: "none" }}
                        >
                          <i
                            className={`bx ${
                              star <= (hoverRating || rating)
                                ? "bxs-star text-warning"
                                : "bx-star text-muted"
                            }`}
                          ></i>
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <div
                        className="badge bg-primary-lt text-primary"
                        style={{ fontSize: "1rem" }}
                      >
                        {ratingDescriptions[rating]}
                      </div>
                    )}
                  </div>

                  {/* Keterangan */}
                  <div className="mb-4">
                    <label className="form-label">
                      <strong>Keterangan (Opsional)</strong>
                    </label>
                    <textarea
                      className="form-control"
                      rows="5"
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Ceritakan pengalaman Anda atau berikan saran untuk perbaikan pelayanan kami..."
                      maxLength="500"
                    />
                    <div className="form-hint text-end">
                      {keterangan.length}/500 karakter
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={submitting || rating === 0}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <i className="bx bx-send me-2"></i>
                          Kirim Penilaian
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      Penilaian Anda akan membantu kami meningkatkan kualitas
                      pelayanan
                    </small>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-muted">
                © {new Date().getFullYear()} Buku Tamu Digital. All rights
                reserved.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
