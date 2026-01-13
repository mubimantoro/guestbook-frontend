import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LayoutAdmin from "../../layouts/Admin";
import Loading from "../../components/Loading";
import RescheduleHistory from "../../components/RescheduleHistory";
import RescheduleConfirmModal from "../../components/RescheduleConfirmModal";
import { DateID } from "../../utils/dateFormatter";
import { getStatusBadge } from "../../utils/statusHelper";
import Api from "../../services/Api";

export default function TamuDetail() {
  document.title = "Detail Tamu - Buku Tamu Digital";

  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  // State untuk data tamu
  const [tamu, setTamu] = useState({});
  const [loading, setLoading] = useState(true);
  const [rescheduleHistories, setRescheduleHistories] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // State untuk form update status
  const [actionType, setActionType] = useState(""); // 'bertemu', 'batal', 'reschedule'
  const [status, setStatus] = useState("");
  const [waktuTemu, setWaktuTemu] = useState("");
  const [alasanBatal, setAlasanBatal] = useState("");
  const [showStatusPertemuanForm, setShowStatusPertemuanForm] = useState(false);

  // State untuk reschedule
  const [jadwalBaru, setJadwalBaru] = useState("");
  const [alasanReschedule, setAlasanReschedule] = useState("");
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State untuk tab
  const [activeTab, setActiveTab] = useState("info");

  // Fetch detail tamu
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/api/tamu/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTamu(response.data.data);

      // Set reschedule histories jika ada
      if (response.data.data.reschedule_histories) {
        setRescheduleHistories(response.data.data.reschedule_histories);
      }
    } catch (error) {
      console.error("Error fetching tamu detail:", error);
      toast.error("Gagal memuat detail tamu");
    } finally {
      setLoading(false);
    }
  };

  // Fetch reschedule history
  const fetchRescheduleHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await Api.get(`/api/tamu/${id}/reschedule-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRescheduleHistories(response.data.data);
    } catch (error) {
      console.error("Error fetching reschedule history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (activeTab === "history") {
      fetchRescheduleHistory();
    }
  }, [activeTab]);

  // Handle action type change
  const handleActionTypeChange = (type) => {
    setActionType(type);

    // Reset semua field
    setWaktuTemu("");
    setAlasanBatal("");
    setJadwalBaru("");
    setAlasanReschedule("");

    // Set status berdasarkan action type
    if (type === "bertemu") {
      setStatus("Disetujui");
    } else if (type === "batal") {
      setStatus("Tidak Bertemu");
    } else if (type === "reschedule") {
      setStatus("Dijadwalkan Ulang");
    }
  };

  // Handle update status tamu (Bertemu / Tidak Bertemu tanpa reschedule)
  const handleUpdateStatusTamu = async (e) => {
    e.preventDefault();

    // Validasi
    if (actionType === "bertemu" && !waktuTemu) {
      toast.error("Waktu bertemu harus diisi");
      return;
    }

    if (actionType === "batal" && !alasanBatal) {
      toast.error("Alasan tidak bertemu harus diisi");
      return;
    }

    try {
      const response = await Api.put(
        `/api/tamu/${id}/status-tamu`,
        {
          status: status,
          waktu_temu: actionType === "bertemu" ? waktuTemu : null,
          alasan_batal: actionType === "batal" ? alasanBatal : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message, {
        position: "top-right",
        duration: 4000,
      });

      // Reset form
      setShowStatusPertemuanForm(false);
      setActionType("");
      setStatus("");
      setWaktuTemu("");
      setAlasanBatal("");

      // Refresh data
      fetchDetail();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Gagal mengupdate status");
    }
  };

  // Handle reschedule - Show confirmation modal
  const handleShowRescheduleConfirm = (e) => {
    e.preventDefault();

    // Validasi
    if (!jadwalBaru) {
      toast.error("Jadwal baru harus diisi");
      return;
    }

    if (!alasanReschedule) {
      toast.error("Alasan penjadwalan ulang harus diisi");
      return;
    }

    // Validasi: Jadwal baru harus lebih dari sekarang
    const now = new Date();
    const newSchedule = new Date(jadwalBaru);
    if (newSchedule <= now) {
      toast.error("Jadwal baru harus lebih dari waktu sekarang");
      return;
    }

    setShowConfirmModal(true);
  };

  // Handle reschedule - Submit
  const handleRescheduleSubmit = async () => {
    setSubmitting(true);

    try {
      const response = await Api.post(
        `/api/tamu/${id}/reschedule`,
        {
          jadwal_baru: jadwalBaru,
          alasan_reschedule: alasanReschedule,
          send_whatsapp: sendWhatsApp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message, {
        position: "top-right",
        duration: 4000,
      });

      // Close modal dan reset form
      setShowConfirmModal(false);
      setShowStatusPertemuanForm(false);
      setActionType("");
      setJadwalBaru("");
      setAlasanReschedule("");
      setSendWhatsApp(true);

      // Refresh data
      fetchDetail();
      fetchRescheduleHistory();

      // Pindah ke tab history
      setActiveTab("history");
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast.error(error.response?.data?.message || "Gagal menjadwalkan ulang");
    } finally {
      setSubmitting(false);
    }
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const config = getStatusBadge(status);
    return (
      <span className={`badge ${config.class}`}>
        <i className={`bx ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bx ${i <= rating ? "bxs-star" : "bx-star"}`}
          style={{
            color: i <= rating ? "#fbbf24" : "#d1d5db",
            fontSize: "1.5rem",
          }}
        ></i>
      );
    }
    return <div className="d-flex gap-1">{stars}</div>;
  };

  const getRatingBadge = (rating) => {
    if (rating >= 4) {
      return { class: "bg-success", text: "Sangat Baik" };
    } else if (rating >= 3) {
      return { class: "bg-primary", text: "Baik" };
    } else if (rating >= 2) {
      return { class: "bg-warning", text: "Cukup" };
    } else {
      return { class: "bg-danger", text: "Kurang" };
    }
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"
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
                {/* Tab Navigation */}
                <div className="card mb-3">
                  <div className="card-header">
                    <ul
                      className="nav nav-tabs card-header-tabs"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            activeTab === "info" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("info")}
                        >
                          <i className="bx bx-info-circle me-2"></i>
                          Informasi Tamu
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            activeTab === "history" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("history")}
                        >
                          <i className="bx bx-history me-2"></i>
                          Riwayat Reschedule
                          {tamu.reschedule_count > 0 && (
                            <span className="badge bg-blue ms-2">
                              {tamu.reschedule_count}
                            </span>
                          )}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "info" && (
                  <>
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
                            <div className="datagrid-content">
                              <a
                                href={`https://wa.me/${tamu.nomor_hp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                <i className="bx bxl-whatsapp me-1"></i>
                                {tamu.nomor_hp}
                              </a>
                            </div>
                          </div>
                          <div className="datagrid-item">
                            <div className="datagrid-title">Asal Instansi</div>
                            <div className="datagrid-content">
                              {tamu.instansi}
                            </div>
                          </div>
                          <div className="datagrid-item">
                            <div className="datagrid-title">
                              Tanggal Kunjungan
                            </div>
                            <div className="datagrid-content">
                              {DateID(new Date(tamu.tanggal_kunjungan))}
                              {tamu.is_rescheduled && (
                                <span className="badge bg-info ms-2">
                                  <i className="bx bx-calendar-edit me-1"></i>
                                  Dijadwalkan Ulang
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="datagrid-item">
                            <div className="datagrid-title">
                              Tujuan Kunjungan
                            </div>
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
                            <div className="datagrid-title">
                              Status Saat Ini
                            </div>
                            <div className="datagrid-content">
                              {renderStatusBadge(tamu.status)}
                            </div>
                          </div>
                          {tamu.status === "Tidak Bertemu" &&
                            tamu.alasan_batal && (
                              <div className="datagrid-item">
                                <div className="datagrid-title">
                                  Alasan Tidak Bertemu
                                </div>
                                <div className="datagrid-content">
                                  <div className="alert alert-danger mb-0 py-2">
                                    <p
                                      className="mb-0"
                                      style={{ whiteSpace: "pre-wrap" }}
                                    >
                                      {tamu.alasan_batal}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Penilaian */}
                    {tamu.penilaian && (
                      <div className="card mb-3">
                        <div className="card-header">
                          <h3 className="card-title">Penilaian Tamu</h3>
                        </div>
                        <div className="card-body">
                          <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <label className="form-label fw-bold mb-0">
                                Rating Pelayanan
                              </label>
                              <span
                                className={`badge ${
                                  getRatingBadge(tamu.penilaian.rating).class
                                }`}
                              >
                                {getRatingBadge(tamu.penilaian.rating).text}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                              {renderStarRating(tamu.penilaian.rating)}
                              <span className="h3 mb-0 text-primary">
                                {tamu.penilaian.rating}
                                <small className="text-muted">/5</small>
                              </span>
                            </div>
                          </div>

                          {tamu.penilaian.keterangan && (
                            <div className="mb-3">
                              <label className="form-label fw-bold">
                                Keterangan / Feedback
                              </label>
                              <div
                                className="card bg-light"
                                style={{ borderLeft: "4px solid #206bc4" }}
                              >
                                <div className="card-body">
                                  <p
                                    className="mb-0"
                                    style={{ whiteSpace: "pre-wrap" }}
                                  >
                                    <i className="bx bx-comment-dots me-2 text-primary"></i>
                                    {tamu.penilaian.keterangan}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!tamu.penilaian && tamu.status === "Disetujui" && (
                      <div className="card mb-3">
                        <div className="card-body text-center py-5">
                          <i
                            className="bx bx-info-circle text-muted mb-3"
                            style={{ fontSize: "3rem" }}
                          ></i>
                          <h3 className="text-muted">Belum Ada Penilaian</h3>
                          <p className="text-muted mb-0">
                            Tamu belum memberikan penilaian untuk pertemuan ini.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "history" && (
                  <RescheduleHistory
                    histories={rescheduleHistories}
                    loading={loadingHistory}
                  />
                )}
              </div>

              {/* Sidebar Kanan */}
              <div className="col-lg-4">
                {/* Update Status Tamu */}
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
                        onSubmit={
                          actionType === "reschedule"
                            ? handleShowRescheduleConfirm
                            : handleUpdateStatusTamu
                        }
                        className="border-top pt-3 mt-3"
                      >
                        <div className="mb-3">
                          <label className="form-label required">
                            Pilih Aksi
                          </label>
                          <div>
                            <label className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="actionType"
                                value="bertemu"
                                checked={actionType === "bertemu"}
                                onChange={(e) =>
                                  handleActionTypeChange(e.target.value)
                                }
                              />
                              <span className="form-check-label">Bertemu</span>
                            </label>

                            <label className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="actionType"
                                value="batal"
                                checked={actionType === "batal"}
                                onChange={(e) =>
                                  handleActionTypeChange(e.target.value)
                                }
                              />
                              <span className="form-check-label">
                                Tidak Bertemu & Batalkan
                              </span>
                            </label>

                            <label className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="actionType"
                                value="reschedule"
                                checked={actionType === "reschedule"}
                                onChange={(e) =>
                                  handleActionTypeChange(e.target.value)
                                }
                              />
                              <span className="form-check-label">
                                Tidak Bertemu & Jadwalkan Ulang
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Form Bertemu */}
                        {actionType === "bertemu" && (
                          <div className="mb-3">
                            <label className="form-label required">
                              Waktu Bertemu
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              value={waktuTemu}
                              onChange={(e) => setWaktuTemu(e.target.value)}
                              required
                            />
                            <small className="form-hint">
                              Pilih tanggal dan waktu pertemuan dilaksanakan
                            </small>
                          </div>
                        )}

                        {/* Form Tidak Bertemu */}
                        {actionType === "batal" && (
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

                        {/* Form Reschedule */}
                        {actionType === "reschedule" && (
                          <>
                            <div className="mb-3">
                              <label className="form-label required">
                                Jadwal Baru
                              </label>
                              <input
                                type="datetime-local"
                                className="form-control"
                                value={jadwalBaru}
                                onChange={(e) => setJadwalBaru(e.target.value)}
                                required
                              />
                              <small className="form-hint">
                                Pilih tanggal dan waktu pertemuan yang baru
                              </small>
                            </div>

                            <div className="mb-3">
                              <label className="form-label required">
                                Alasan Penjadwalan Ulang
                              </label>
                              <textarea
                                className="form-control"
                                rows="4"
                                value={alasanReschedule}
                                onChange={(e) =>
                                  setAlasanReschedule(e.target.value)
                                }
                                placeholder="Contoh: PIC sedang ada meeting mendadak..."
                                required
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={sendWhatsApp}
                                  onChange={(e) =>
                                    setSendWhatsApp(e.target.checked)
                                  }
                                />
                                <span className="form-check-label">
                                  <i className="bx bxl-whatsapp me-1"></i>
                                  Kirim notifikasi WhatsApp
                                </span>
                              </label>
                              <small className="form-hint">
                                Tamu akan menerima pemberitahuan perubahan
                                jadwal via WhatsApp
                              </small>
                            </div>
                          </>
                        )}

                        <div className="d-flex gap-2">
                          <button
                            type="submit"
                            className="btn btn-primary flex-fill"
                          >
                            <i className="bx bx-save me-2"></i>
                            {actionType === "reschedule"
                              ? "Jadwalkan Ulang"
                              : "Simpan Status"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setShowStatusPertemuanForm(false);
                              setActionType("");
                              setStatus("");
                              setWaktuTemu("");
                              setAlasanBatal("");
                              setJadwalBaru("");
                              setAlasanReschedule("");
                            }}
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Informasi PIC */}
                {tamu.penanggung_jawab && (
                  <div className="card mb-3">
                    <div className="card-header">
                      <h3 className="card-title">Penanggung Jawab (PIC)</h3>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-md me-3">
                          {tamu.penanggung_jawab.user?.nama_lengkap
                            ?.charAt(0)
                            .toUpperCase()}
                        </span>
                        <div className="flex-fill">
                          <div className="font-weight-medium">
                            {tamu.penanggung_jawab.user?.nama_lengkap}
                          </div>
                          <div className="text-muted small">
                            <a
                              href={`https://wa.me/${tamu.penanggung_jawab.user?.nomor_hp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              <i className="bx bxl-whatsapp me-1"></i>
                              {tamu.penanggung_jawab.user?.nomor_hp}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Reschedule Count */}
                {tamu.is_rescheduled && tamu.reschedule_count > 0 && (
                  <div className="card bg-info-lt">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i
                            className="bx bx-calendar-edit text-info"
                            style={{ fontSize: "2rem" }}
                          ></i>
                        </div>
                        <div>
                          <div className="fw-bold">Telah Dijadwalkan Ulang</div>
                          <div className="text-muted">
                            {tamu.reschedule_count}x perubahan jadwal
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

      {/* Modal Konfirmasi Reschedule */}
      <RescheduleConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleRescheduleSubmit}
        loading={submitting}
        data={{
          tamuNama: tamu.nama_lengkap,
          tamuInstansi: tamu.instansi,
          jadwalLama: tamu.tanggal_kunjungan,
          jadwalBaru: jadwalBaru,
          alasan: alasanReschedule,
          sendWhatsApp: sendWhatsApp,
        }}
      />
    </LayoutAdmin>
  );
}
