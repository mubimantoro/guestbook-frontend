import { useEffect, useState } from "react";
import LayoutWeb from "../../../layouts/Web";
import Api from "../../../services/Api";
import toast from "react-hot-toast";

export default function TamuWeb() {
  document.title = "Buku Tamu Digital KGTK Gorontalo";

  const [namaLengkap, setNamaLengkap] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [instansi, setInstansi] = useState("");
  const [kategoriKunjunganId, setKategoriKunjunganId] = useState("");
  const [tanggalKunjungan, setTanggalKunjungan] = useState("");
  const [catatan, setCatatan] = useState("");
  const [errors, setErrors] = useState([]);

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

    const formData = new FormData();

    formData.append("nama_lengkap", namaLengkap);
    formData.append("nomor_hp", nomorHp);
    formData.append("instansi", instansi);
    formData.append("kategori_kunjungan_id", kategoriKunjunganId);
    formData.append("tanggal_kunjungan", tanggalKunjungan);
    formData.append("catatan", catatan);

    await Api.post("/api/public/tamu", formData)
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-right",
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        setNamaLengkap("");
        setNomorHp("");
        setInstansi("");
        setKategoriKunjunganId("");
        setTanggalKunjungan("");
        setCatatan("");
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  const handleReset = () => {
    setNamaLengkap("");
    setNomorHp("");
    setInstansi("");
    setKategoriKunjunganId("");
    setTanggalKunjungan("");
    setCatatan("");
  };

  return (
    <LayoutWeb>
      <div className="container-xl">
        <div className="page-header d-print-none mt-4">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">
                <i className="bx bx-book me-2"></i>Buku Tamu
              </h2>
              <div className="text-muted mt-1">
                Silakan isi form di bawah ini untuk mencatat kunjungan Anda
              </div>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="container-xl">
            <div className="row row-cards">
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="card-status-top bg-primary"></div>
                  <div className="card-body">
                    <form onSubmit={storeTamu}>
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label required">
                            Nama Lengkap
                          </label>
                          <div className="input-group input-group-flat">
                            <span className="input-group-text">
                              <i className="bx bx-user text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              value={namaLengkap}
                              onChange={(e) => setNamaLengkap(e.target.value)}
                              placeholder="Masukkan nama lengkap Anda"
                            />
                          </div>
                          {errors.nama_lengkap && (
                            <div className="alert alert-danger mt-2">
                              {errors.nama_lengkap[0]}
                            </div>
                          )}
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="form-label required">
                            Nomor WhatsApp
                          </label>
                          <div className="input-group input-group-flat">
                            <span className="input-group-text">
                              <i className="bx bxl-whatsapp text-success"></i>
                            </span>
                            <input
                              type="tel"
                              className="form-control"
                              value={nomorHp}
                              onChange={(e) => setNomorHp(e.target.value)}
                              placeholder="08xxxxxxxxxx"
                            />
                          </div>
                          {errors.nomor_hp && (
                            <div className="alert alert-danger mt-2">
                              {errors.nomor_hp[0]}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label required">
                            Asal Instansi
                          </label>
                          <div className="input-group input-group-flat">
                            <span className="input-group-text">
                              <i className="bx bx-buildings text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              value={instansi}
                              onChange={(e) => setInstansi(e.target.value)}
                              placeholder="Nama instansi"
                            />
                          </div>
                          {errors.instansi && (
                            <div className="alert alert-danger mt-2">
                              {errors.instansi[0]}
                            </div>
                          )}
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="form-label required">
                            Tanggal Kunjungan
                          </label>
                          <div className="input-group input-group-flat">
                            <span className="input-group-text">
                              <i className="bx bx-calendar text-muted"></i>
                            </span>
                            <input
                              type="date"
                              className="form-control"
                              value={tanggalKunjungan}
                              onChange={(e) =>
                                setTanggalKunjungan(e.target.value)
                              }
                            />
                          </div>
                          {errors.tanggal_kunjungan && (
                            <div className="alert alert-danger mt-2">
                              {errors.tanggal_kunjungan[0]}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label required">
                          Tujuan Kunjungan
                        </label>
                        <div className="text-muted small mb-2">
                          <i className="bx bx-info-circle me-1"></i>
                          Pilih tujuan kunjungan Anda agar dapat diarahkan ke
                          penanggung jawab yang tepat
                        </div>
                        <div className="form-selectgroup form-selectgroup-boxes d-flex flex-column">
                          {kategoriKunjungan.map((item) => (
                            <label
                              key={item.id}
                              className="form-selectgroup-item flex-fill"
                            >
                              <input
                                type="radio"
                                value={item.id}
                                className="form-selectgroup-input"
                                checked={
                                  kategoriKunjunganId === String(item.id)
                                }
                                onChange={(e) =>
                                  setKategoriKunjunganId(e.target.value)
                                }
                              />
                              <div className="form-selectgroup-label d-flex align-items-center p-3">
                                <div className="me-3">
                                  <span
                                    className={`avatar bg-${item.color}-lt`}
                                  >
                                    <i className={`bx ${item.icon}`}></i>
                                  </span>
                                </div>
                                <div className="form-selectgroup-label-content d-flex align-items-center justify-content-between flex-fill">
                                  <div>
                                    <div className="font-weight-medium">
                                      {item.nama}
                                    </div>
                                  </div>
                                  {kategoriKunjunganId === String(item.id) && (
                                    <div className="text-success">
                                      <i className="bx bx-check-circle fs-3"></i>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.kategori_kunjungan_id && (
                          <div className="invalid-feedback d-block">
                            {errors.kategori_kunjungan_id[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Catatan/Keperluan
                          <span className="form-label-description">
                            Opsional
                          </span>
                        </label>
                        <textarea
                          className="form-control"
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                          rows="4"
                          placeholder="Jelaskan keperluan atau tujuan kunjungan Anda..."
                        ></textarea>
                      </div>

                      <div className="form-footer">
                        <div className="d-flex gap-2">
                          <button
                            type="submit"
                            className="btn btn-primary flex-fill"
                          >
                            <i className="bx bx-send me-2"></i>
                            Kirim Data Kunjungan
                          </button>
                          <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline-secondary"
                          >
                            <i className="bx bx-reset me-2"></i>
                            Reset
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-3">
                      <i className="bx bx-help-circle me-2"></i>Butuh Bantuan?
                    </h4>
                    <p className="text-muted mb-3">
                      Jika Anda mengalami kesulitan dalam mengisi form, silakan
                      hubungi:
                    </p>
                    <div className="d-grid gap-2">
                      <a href="#" className="btn btn-outline-primary">
                        <i className="bx bx-phone me-2"></i>
                        Hubungi Admin
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWeb>
  );
}
