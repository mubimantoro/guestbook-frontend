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
  const [penanggungJawabId, setPenanggungJawabId] = useState("");
  const [tanggalKunjungan, setTanggalKunjungan] = useState("");
  const [catatan, setCatatan] = useState("");
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreement, setAgreement] = useState(false);

  const [kategoriKunjungan, setKategoriKunjungan] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  const fetchDataKategoriKunjungan = async () => {
    try {
      const response = await Api.get("/api/public/kategori-kunjungan/all");
      setKategoriKunjungan(response.data.data || []);
    } catch (error) {
      console.error("Error fetching kategori:", error);
      toast.error("Gagal mengambil data kategori kunjungan");
    }
  };

  const fetchAvailableStaff = async (kategoriId, tanggal) => {
    if (!kategoriId || !tanggal) {
      setAvailableStaff([]);
      return;
    }

    setIsLoadingStaff(true);
    setAvailableStaff([]);
    setPenanggungJawabId("");

    try {
      const response = await Api.get("/api/public/staff-available", {
        params: {
          kategori_kunjungan_id: kategoriId,
          tanggal: tanggal,
        },
      });

      const staffData = response.data.data || [];

      console.log("Staff Data parsed:", staffData);

      setAvailableStaff(staffData);

      if (staffData.length === 0) {
        toast.error(
          "Tidak ada staff yang tersedia untuk kategori dan tanggal yang dipilih",
          {
            position: "top-right",
            duration: 4000,
          }
        );
      } else {
        toast.success(`Ditemukan ${staffData.length} staff yang tersedia`, {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Gagal mengambil data staff tersedia");
      setAvailableStaff([]);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchDataKategoriKunjungan();

    // Prevent default form submission on Enter key
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKategoriChange = (e) => {
    const selectedKategori = e.target.value;
    console.log("Kategori selected:", selectedKategori);

    setKategoriKunjunganId(selectedKategori);
    setPenanggungJawabId("");
    setAvailableStaff([]); // Clear staff list immediately

    // Fetch staff jika tanggal sudah dipilih
    if (selectedKategori && tanggalKunjungan) {
      console.log("Fetching staff with:", {
        selectedKategori,
        tanggalKunjungan,
      });
      fetchAvailableStaff(selectedKategori, tanggalKunjungan);
    }
  };

  const handleTanggalChange = (e) => {
    const selectedTanggal = e.target.value;
    console.log("Tanggal selected:", selectedTanggal);

    setTanggalKunjungan(selectedTanggal);
    setPenanggungJawabId("");
    setAvailableStaff([]); // Clear staff list immediately

    // Fetch staff jika kategori sudah dipilih
    if (kategoriKunjunganId && selectedTanggal) {
      console.log("Fetching staff with:", {
        kategoriKunjunganId,
        selectedTanggal,
      });
      fetchAvailableStaff(kategoriKunjunganId, selectedTanggal);
    }
  };

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
    formData.append("penanggung_jawab_id", penanggungJawabId);
    formData.append("tanggal_kunjungan", tanggalKunjungan);
    formData.append("catatan", catatan);

    try {
      const response = await Api.post("/api/public/tamu", formData);

      setNamaLengkap("");
      setNomorHp("");
      setInstansi("");
      setKategoriKunjunganId("");
      setPenanggungJawabId("");
      setTanggalKunjungan("");
      setCatatan("");
      setAgreement(false);
      setErrors([]);
      setAvailableStaff([]);

      navigate("/success", {
        state: {
          tamuData: response.data.data,
        },
      });
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      toast.error(
        error.response?.data?.message || "Gagal mengirim pendaftaran"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setNamaLengkap("");
    setNomorHp("");
    setInstansi("");
    setKategoriKunjunganId("");
    setPenanggungJawabId("");
    setTanggalKunjungan("");
    setCatatan("");
    setAgreement(false);
    setAvailableStaff([]);
    setErrors([]);
  };

  const today = new Date().toISOString().split("T")[0];

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
              <img
                src="/images/Logo-KGTK-Gorontalo.png"
                alt="Logo KGTK Gorontalo"
                style={{ height: "40px", width: "auto" }}
              />
              Buku Tamu Digital
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
                              placeholder="Masukkan nama instansi Anda"
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

                      {/* Informasi Kunjungan */}
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
                              onChange={handleTanggalChange}
                              min={today}
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
                              onChange={handleKategoriChange}
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

                          {/* Staff Yang Dituju - Muncul setelah kategori dan tanggal dipilih */}
                          {kategoriKunjunganId && tanggalKunjungan && (
                            <div className="col-md-12">
                              <label className="form-label required">
                                Staff Yang Dituju
                              </label>

                              {isLoadingStaff ? (
                                <div className="card">
                                  <div className="card-body text-center py-4">
                                    <div
                                      className="spinner-border text-primary mb-2"
                                      role="status"
                                    >
                                      <span className="visually-hidden">
                                        Loading...
                                      </span>
                                    </div>
                                    <div className="text-muted small">
                                      Memuat data staff tersedia...
                                    </div>
                                  </div>
                                </div>
                              ) : availableStaff.length === 0 ? (
                                <div
                                  className="alert alert-warning mb-0"
                                  role="alert"
                                >
                                  <div className="d-flex align-items-center">
                                    <i className="bx bx-error-circle me-2 fs-4"></i>
                                    <div>
                                      <strong>
                                        Tidak ada staff yang tersedia
                                      </strong>
                                      <div className="small mt-1">
                                        Tidak ada staff yang hadir untuk
                                        kategori dan tanggal yang dipilih.
                                        Silakan pilih tanggal lain atau hubungi
                                        resepsionis.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <select
                                    className={`form-select ${
                                      errors.penanggung_jawab_id
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    value={penanggungJawabId}
                                    onChange={(e) =>
                                      setPenanggungJawabId(e.target.value)
                                    }
                                    disabled={isSubmitting}
                                    style={{ padding: "0.625rem 0.75rem" }}
                                  >
                                    <option value="">
                                      Pilih staff yang akan ditemui
                                    </option>
                                    {availableStaff.map((staff) => (
                                      <option key={staff.id} value={staff.id}>
                                        {staff.user.nama_lengkap} -{" "}
                                        {staff.kategori_kunjungan.nama}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.penanggung_jawab_id && (
                                    <div className="invalid-feedback">
                                      {errors.penanggung_jawab_id[0]}
                                    </div>
                                  )}
                                  <div className="form-text">
                                    <i className="bx bx-info-circle me-1"></i>
                                    {availableStaff.length} staff tersedia untuk
                                    tanggal yang dipilih
                                  </div>
                                </>
                              )}
                            </div>
                          )}

                          <div className="col-md-12">
                            <label className="form-label required">
                              Keperluan/Detail Kunjungan
                            </label>
                            <textarea
                              className={`form-control ${
                                errors.catatan ? "is-invalid" : ""
                              }`}
                              value={catatan}
                              onChange={(e) => setCatatan(e.target.value)}
                              rows="3"
                              placeholder="Jelaskan secara singkat keperluan atau agenda kunjungan Anda..."
                              disabled={isSubmitting}
                              style={{ padding: "0.625rem 0.75rem" }}
                            ></textarea>
                            {errors.catatan && (
                              <div className="invalid-feedback">
                                {errors.catatan[0]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <hr className="my-4" />

                      {/* Agreement */}
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

                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary flex-fill"
                          disabled={
                            isSubmitting ||
                            !agreement ||
                            (kategoriKunjunganId &&
                              tanggalKunjungan &&
                              availableStaff.length === 0)
                          }
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
