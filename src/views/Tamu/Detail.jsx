import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LayoutAdmin from "../../layouts/Admin";
import Loading from "../../components/Loading";
import DateID from "../../utils/DateID";
import { getStatusBadge } from "../../utils/TamuStatus";
import Api from "../../services/Api";

export default function TamuDetail() {
  document.title = "Detail Tamu - Buku Tamu Digital";

  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [tamu, setTamu] = useState({});
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [waktuTemu, setWaktuTemu] = useState("");
  const [alasanBatal, setAlasanBatal] = useState("");
  const [showStatusPertemuanForm, setShowStatusPertemuanForm] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    await Api.get(`/api/tamu/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setTamu(response.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  // Update status Tamu
  const handleUpdateStatusTamu = async (e) => {
    e.preventDefault();

    await Api.put(
      `/api/tamu/${id}/status-tamu`,
      {
        status: status,
        waktu_temu: status === "Disetujui" ? waktuTemu : null,
        alasan_batal: status === "Tidak Bertemu" ? alasanBatal : null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      toast.success(response.data.message, {
        position: "top-right",
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      setShowStatusPertemuanForm(false);
      setStatus("");
      setWaktuTemu("");
      setAlasanBatal("");
      fetchDetail();
    });
  };

  const renderStatusBadge = (status) => {
    const config = getStatusBadge(status);
    return (
      <span className={`badge ${config.class}`}>
        <i className={`bx ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <Link to="/dashboard" className="btn btn-primary rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l14 0" />
                  <path d="M5 12l4 4" />
                  <path d="M5 12l4 -4" />
                </svg>
                Kembali
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Page Body */}
      <div className="page-body">
        <div className="container-xl">
          {loading ? (
            <Loading />
          ) : (
            <div className="row row-cards">
              <div className="col-lg-8">
                {/* Informasi Tamu */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h3 className="card-title">
                      <i className="bx bx-id-card me-2"></i>
                      Informasi Tamu
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="datagrid">
                      <div className="datagrid-item">
                        <div className="datagrid-title">ID Kunjungan</div>
                        <div className="datagrid-content">
                          <strong>{tamu.kode_kunjungan}</strong>
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">Nama Lengkap</div>
                        <div className="datagrid-content">
                          <strong>{tamu.nama_lengkap}</strong>
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">Nomor WhatsApp</div>
                        <div className="datagrid-content">{tamu.nomor_hp}</div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">Asal Instansi</div>
                        <div className="datagrid-content">{tamu.instansi}</div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">Tanggal Kunjungan</div>
                        <div className="datagrid-content">
                          {DateID(new Date(tamu.tanggal_kunjungan))}
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">Tujuan Kunjungan</div>
                        <div className="datagrid-content">
                          {tamu.kategori_kunjungan?.nama || "-"}
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">
                          Catatan / Keperluan
                        </div>
                        <div className="datagrid-content">
                          {tamu.catatan ? (
                            <p
                              className="mb-0"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {tamu.catatan}
                            </p>
                          ) : (
                            <div className="text-muted">
                              Tidak ada catatan tambahan
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">Dibuat Pada</div>
                        <div className="datagrid-content">
                          {DateID(new Date(tamu.created_at))}
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">Status Saat Ini</div>
                        <div className="datagrid-content">
                          {renderStatusBadge(tamu.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Status Tamu */}
              <div className="col-lg-4">
                <div className="card mb-3">
                  <div className="card-header">
                    <h3 className="card-title">
                      <i className="bx bx-bolt me-2"></i>
                      Update Status Tamu
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button
                        onClick={() =>
                          setShowStatusPertemuanForm(!showStatusPertemuanForm)
                        }
                        className="btn btn-primary"
                      >
                        <i className="bx bx-edit me-2"></i>
                        Update Status Tamu
                      </button>
                    </div>

                    {showStatusPertemuanForm && (
                      <form
                        onSubmit={handleUpdateStatusTamu}
                        className="border-top pt-3"
                      >
                        <div className="mb-3">
                          <label className="form-label required">
                            Status Tamu
                          </label>
                          <div>
                            <label className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                value="Disetujui"
                                checked={status === "Disetujui"}
                                onChange={(e) => {
                                  setStatus(e.target.value);
                                  setAlasanBatal("");
                                }}
                              />
                              <span className="form-check-label">Bertemu</span>
                            </label>
                            <label className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                value="Tidak Bertemu"
                                checked={status === "Tidak Bertemu"}
                                onChange={(e) => {
                                  setStatus(e.target.value);
                                  setWaktuTemu("");
                                }}
                              />
                              <span className="form-check-label">
                                Tidak Bertemu
                              </span>
                            </label>
                          </div>
                        </div>

                        {status === "Disetujui" && (
                          <div className="mb-3">
                            <label className="form-label required">
                              Waktu Bertemu
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              value={waktuTemu}
                              onChange={(e) => setWaktuTemu(e.target.value)}
                            />
                            <small className="form-hint">
                              Pilih tanggal dan waktu pertemuan dilaksanakan
                            </small>
                          </div>
                        )}

                        {status === "Tidak Bertemu" && (
                          <div className="mb-3">
                            <label className="form-label required">
                              Alasan Tidak Bertemu
                            </label>
                            <textarea
                              className="form-control"
                              rows="4"
                              value={alasanBatal}
                              onChange={(e) => setAlasanBatal(e.target.value)}
                              placeholder="Alasan pertemuan tidak dapat dilaksanakan..."
                              required
                            />
                          </div>
                        )}

                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-primary">
                            <i className="bx bx-save me-2"></i>
                            Simpan Status Pertemuan
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setShowStatusPertemuanForm(false);
                              setStatus("");
                              setWaktuTemu("");
                              setAlasanBatal("");
                            }}
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Informasi PIC - TAMBAHAN BARU */}
                {tamu.pic && (
                  <div className="card mb-3">
                    <div className="card-header">
                      <h3 className="card-title">Penanggung Jawab (PIC)</h3>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-md me-3">
                          {tamu.pic.user?.nama_lengkap?.charAt(0).toUpperCase()}
                        </span>
                        <div className="flex-fill">
                          <div className="font-weight-medium">
                            {tamu.pic.user?.nama_lengkap}
                          </div>
                          <div className="text-muted small">
                            {tamu.pic.user?.nomor_hp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}
