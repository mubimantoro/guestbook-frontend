import { useEffect, useState } from "react";
import Api from "../../../services/Api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function TamuWeb() {
  document.title = "Buku Tamu Digital KGTK Gorontalo";
  const navigate = useNavigate();

  const [namaLengkap, setNamaLengkap] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [instansi, setInstansi] = useState("");
  const [kategoriKunjunganId, setKategoriKunjunganId] = useState("");
  const [tanggalKunjungan, setTanggalKunjungan] = useState("");
  const [catatan, setCatatan] = useState("");
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreement, setAgreement] = useState(false);

  const [kategoriKunjungan, setKategoriKunjungan] = useState([]);

  const fetchDataKategoriKunjungan = async () => {
    await Api.get("/api/public/kategori-kunjungan/all").then((response) => {
      setKategoriKunjungan(response.data.data);
    });
  };

  useEffect(() => {
    fetchDataKategoriKunjungan();
  }, []);

  const storeTamu = async (e) => {
    e.preventDefault();

    if (!agreement) {
      toast.error("Anda harus menyetujui peraturan terlebih dahulu", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("nama_lengkap", namaLengkap);
    formData.append("nomor_hp", nomorHp);
    formData.append("instansi", instansi);
    formData.append("kategori_kunjungan_id", kategoriKunjunganId);
    formData.append("tanggal_kunjungan", tanggalKunjungan);
    formData.append("catatan", catatan);

    await Api.post("/api/public/tamu", formData)
      .then((response) => {
        setNamaLengkap("");
        setNomorHp("");
        setInstansi("");
        setKategoriKunjunganId("");
        setTanggalKunjungan("");
        setCatatan("");
        setAgreement(false);
        setErrors([]);

        navigate("/success", {
          state: {
            tamuData: response.data.data,
          },
        });
      })
      .catch((error) => {
        setErrors(error.response.data);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleReset = () => {
    setNamaLengkap("");
    setNomorHp("");
    setInstansi("");
    setKategoriKunjunganId("");
    setTanggalKunjungan("");
    setCatatan("");
    setAgreement(false);
    setErrors([]);
  };

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
              <div className="col-lg-9 col-xl-8">
                <div className="card rounded-3 mb-4">
                  <div className="card-body text-center py-4">
                    <h3 className="mb-3">Selamat Datang</h3>
                    <p className="text-muted mb-0">
                      Terima kasih telah berkunjung ke KGTK Gorontalo
                      Kemdikbudristek. Mohon lengkapi formulir pendaftaran
                      kunjungan di bawah ini dengan data yang benar dan lengkap.
                    </p>
                  </div>
                </div>

                <div className="card rounded-3 mb-4">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Ketentuan Kunjungan</h3>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="text-center p-3">
                          <span className="avatar avatar-md bg-primary-lt mb-3">
                            <i className="bx bx-id-card fs-3"></i>
                          </span>
                          <div className="small fw-bold mb-1">
                            Kartu ID Pengunjung
                          </div>
                          <div className="text-muted small">
                            Wajib mengenakan kartu ID yang diberikan selama di
                            area KGTK
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center p-3">
                          <span className="avatar avatar-md bg-success-lt mb-3">
                            <i className="bx bx-log-out-circle fs-3"></i>
                          </span>
                          <div className="small fw-bold mb-1">
                            Pengembalian Kartu
                          </div>
                          <div className="text-muted small">
                            Kembalikan kartu ID kepada resepsionis sebelum
                            meninggalkan gedung
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center p-3">
                          <span className="avatar avatar-md bg-warning-lt mb-3">
                            <i className="bx bx-check-shield fs-3"></i>
                          </span>
                          <div className="small fw-bold mb-1">Komitmen</div>
                          <div className="text-muted small">
                            Berkomitmen mematuhi seluruh peraturan yang berlaku
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card rounded-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">
                      Formulir Pendaftaran Kunjungan
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <form onSubmit={storeTamu}>
                      {/* Data Diri */}
                      <div className="mb-4">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label required">
                              Nama Lengkap
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.nama_lengkap ? "is-invalid" : ""
                              }`}
                              value={namaLengkap}
                              onChange={(e) => setNamaLengkap(e.target.value)}
                              placeholder="Masukkan nama lengkap Anda"
                              disabled={isSubmitting}
                              style={{ padding: "0.625rem 0.75rem" }}
                            />
                            {errors.nama_lengkap && (
                              <div className="invalid-feedback">
                                {errors.nama_lengkap[0]}
                              </div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label required">
                              Nomor WhatsApp
                            </label>
                            <input
                              type="tel"
                              className={`form-control ${
                                errors.nomor_hp ? "is-invalid" : ""
                              }`}
                              value={nomorHp}
                              onChange={(e) => setNomorHp(e.target.value)}
                              placeholder="Contoh: 081234567890"
                              disabled={isSubmitting}
                              style={{ padding: "0.625rem 0.75rem" }}
                            />
                            {errors.nomor_hp && (
                              <div className="invalid-feedback">
                                {errors.nomor_hp[0]}
                              </div>
                            )}
                          </div>

                          <div className="col-md-12">
                            <label className="form-label required">
                              Asal Instansi
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.instansi ? "is-invalid" : ""
                              }`}
                              value={instansi}
                              onChange={(e) => setInstansi(e.target.value)}
                              disabled={isSubmitting}
                              style={{ padding: "0.625rem 0.75rem" }}
                            />
                            {errors.instansi && (
                              <div className="invalid-feedback">
                                {errors.instansi[0]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label required">
                              Tanggal Kunjungan
                            </label>
                            <input
                              type="date"
                              className={`form-control ${
                                errors.tanggal_kunjungan ? "is-invalid" : ""
                              }`}
                              value={tanggalKunjungan}
                              onChange={(e) =>
                                setTanggalKunjungan(e.target.value)
                              }
                              disabled={isSubmitting}
                              style={{ padding: "0.625rem 0.75rem" }}
                            />
                            {errors.tanggal_kunjungan && (
                              <div className="invalid-feedback">
                                {errors.tanggal_kunjungan[0]}
                              </div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label required">
                              Tujuan Kunjungan
                            </label>
                            <select
                              className={`form-select ${
                                errors.kategori_kunjungan_id ? "is-invalid" : ""
                              }`}
                              value={kategoriKunjunganId}
                              onChange={(e) =>
                                setKategoriKunjunganId(e.target.value)
                              }
                              disabled={isSubmitting}
                              style={{ padding: "0.625rem 0.75rem" }}
                            >
                              <option value="">Pilih tujuan kunjungan</option>
                              {kategoriKunjungan.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.nama}
                                </option>
                              ))}
                            </select>
                            {errors.kategori_kunjungan_id && (
                              <div className="invalid-feedback">
                                {errors.kategori_kunjungan_id[0]}
                              </div>
                            )}
                          </div>

                          <div className="col-md-12">
                            <label className="form-label">
                              Keperluan/Detail Kunjungan
                              <span className="text-muted ms-1">
                                (Opsional)
                              </span>
                            </label>
                            <textarea
                              className="form-control"
                              value={catatan}
                              onChange={(e) => setCatatan(e.target.value)}
                              rows="3"
                              placeholder="Jelaskan secara singkat keperluan atau agenda kunjungan Anda..."
                              disabled={isSubmitting}
                              style={{ padding: "0.625rem 0.75rem" }}
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      <hr className="my-4" />

                      <div className="mb-4">
                        <div
                          className="form-check"
                          style={{
                            padding: "2rem",
                            background: "#f8f9fa",
                            borderRadius: "0.5rem",
                          }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="agreement"
                            checked={agreement}
                            onChange={(e) => setAgreement(e.target.checked)}
                            disabled={isSubmitting}
                            style={{ marginTop: "0.25rem" }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="agreement"
                            style={{ fontSize: "0.9375rem" }}
                          >
                            Saya telah membaca dan menyetujui ketentuan
                            kunjungan yang berlaku di KGTK Gorontalo, serta
                            berkomitmen untuk mematuhi seluruh peraturan yang
                            telah ditetapkan.
                          </label>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary flex-fill"
                          disabled={isSubmitting || !agreement}
                          style={{ padding: "0.75rem 1.5rem" }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Mengirim Data...
                            </>
                          ) : (
                            <>
                              <i className="bx bx-send me-2"></i>
                              Kirim Pendaftaran
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="btn btn-outline-secondary"
                          disabled={isSubmitting}
                          style={{ padding: "0.75rem 1.5rem" }}
                        >
                          <i className="bx bx-reset me-2"></i>
                          Reset
                        </button>
                      </div>
                    </form>
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
    </div>
  );
}
