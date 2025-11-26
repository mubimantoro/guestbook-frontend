import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Api from "../../../services/Api";
import toast from "react-hot-toast";
import LayoutAdmin from "../../../layouts/Admin";

export default function TamuDetail() {
  document.title = "Detail Tamu - Buku Tamu Digital";

  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [tamu, setTamu] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    await Api.get(`/api/tamu/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setTamu(response.data.data);
    });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  // Update status
  const updateStatus = async (newStatus) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`
      )
    ) {
      return;
    }

    setUpdating(true);
    try {
      await Api.put(
        `/api/admin/tamu/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Status berhasil diperbarui!", {
        position: "top-right",
        duration: 4000,
      });

      // Refresh data
      fetchDetail();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal memperbarui status");
    } finally {
      setUpdating(false);
    }
  };

  // Delete tamu
  const deleteTamu = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data tamu ini?")) {
      return;
    }

    try {
      await Api.delete(`/api/admin/tamu/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Data tamu berhasil dihapus!", {
        position: "top-right",
        duration: 4000,
      });

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Gagal menghapus data tamu");
    }
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

  const formatDateOnly = (dateString) => {
    if (!dateString) return "-";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        class: "bg-yellow",
        icon: "bx-time-five",
        text: "Menunggu Konfirmasi",
      },
      approved: {
        class: "bg-green",
        icon: "bx-check-circle",
        text: "Disetujui",
      },
      rejected: { class: "bg-red", icon: "bx-x-circle", text: "Ditolak" },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      icon: "bx-info-circle",
      text: status,
    };

    return (
      <span className={`badge ${config.class} badge-pill`}>
        <i className={`bx ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  return (
    <LayoutAdmin>
      {/* Page Header */}
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn btn-sm btn-ghost-secondary me-2"
                >
                  <i className="bx bx-arrow-back"></i>
                </button>
                Detail Kunjungan Tamu
              </div>
              <h2 className="page-title">
                <i className="bx bx-user me-2"></i>
                {tamu.nama_lengkap}
              </h2>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button
                  onClick={() => window.print()}
                  className="btn btn-outline-secondary"
                >
                  <i className="bx bx-printer me-2"></i>
                  Cetak
                </button>
                <button onClick={deleteTamu} className="btn btn-outline-danger">
                  <i className="bx bx-trash me-2"></i>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Body */}
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            {/* Left Column - Main Info */}
            <div className="col-lg-8">
              {/* Status Card */}
              <div className="card mb-3">
                <div className="card-status-top bg-primary"></div>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h3 className="card-title mb-1">Status Kunjungan</h3>
                      <div className="text-muted">
                        {getStatusBadge(tamu.status)}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="btn-list">
                        {tamu.status !== "approved" && (
                          <button
                            onClick={() => updateStatus("approved")}
                            className="btn btn-success"
                            disabled={updating}
                          >
                            {updating ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Loading...
                              </>
                            ) : (
                              <>
                                <i className="bx bx-check me-2"></i>
                                Setujui
                              </>
                            )}
                          </button>
                        )}
                        {tamu.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus("rejected")}
                            className="btn btn-danger"
                            disabled={updating}
                          >
                            {updating ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Loading...
                              </>
                            ) : (
                              <>
                                <i className="bx bx-x me-2"></i>
                                Tolak
                              </>
                            )}
                          </button>
                        )}
                        {tamu.status !== "pending" && (
                          <button
                            onClick={() => updateStatus("pending")}
                            className="btn btn-warning"
                            disabled={updating}
                          >
                            <i className="bx bx-time me-2"></i>
                            Pending
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                        {formatDateOnly(tamu.tanggal_kunjungan)}
                      </div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">Tujuan Kunjungan</div>
                      <div className="datagrid-content">
                        {tamu.kategori_kunjungan.nama}
                      </div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">Catatan/Keperluan</div>
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
                        {formatDate(tamu.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Timeline & Actions */}
            <div className="col-lg-4">
              {/* Quick Actions */}
              <div className="card mb-3">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="bx bx-bolt me-2"></i>
                    Tindakan Cepat
                  </h3>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    {/* <a
                      href={`https://wa.me/${tamu.nomor_hp.replace(
                        /^0/,
                        "62"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success"
                    >
                      <i className="bx bxl-whatsapp me-2"></i>
                      Hubungi via WhatsApp
                    </a> */}
                    <a
                      href={`tel:${tamu.nomor_hp}`}
                      className="btn btn-primary"
                    >
                      <i className="bx bx-phone me-2"></i>
                      Telepon
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Nama: ${tamu.nama_lengkap}\nInstansi: ${
                            tamu.instansi
                          }\nNo. HP: ${tamu.nomor_hp}\nTujuan: ${
                            tamu.kategoriKunjungan?.nama || "-"
                          }`
                        );
                        toast.success("Data berhasil disalin!");
                      }}
                      className="btn btn-outline-secondary"
                    >
                      <i className="bx bx-copy me-2"></i>
                      Salin Info
                    </button>
                  </div>
                </div>
              </div>

              {/* Informasi Sistem */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="bx bx-info-circle me-2"></i>
                    Informasi Sistem
                  </h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="text-muted small mb-1">ID Kunjungan</div>
                    <div className="font-weight-medium">#{tamu.id}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-muted small mb-1">Dibuat pada</div>
                    <div className="font-weight-medium">
                      <i className="bx bx-time me-1"></i>
                      {formatDate(tamu.created_at)}
                    </div>
                  </div>
                  {tamu.updated_at && tamu.updated_at !== tamu.created_at && (
                    <div className="mb-3">
                      <div className="text-muted small mb-1">
                        Terakhir diperbarui
                      </div>
                      <div className="font-weight-medium">
                        <i className="bx bx-time me-1"></i>
                        {formatDate(tamu.updated_at)}
                      </div>
                    </div>
                  )}

                  {/* Penanggung Jawab Info */}
                  {tamu.kategoriKunjungan?.penanggung_jawab && (
                    <div className="alert alert-info mt-3 mb-0">
                      <div className="text-muted small mb-1">
                        Penanggung Jawab
                      </div>
                      <div className="font-weight-medium">
                        <i className="bx bx-user me-1"></i>
                        {tamu.kategoriKunjungan.penanggung_jawab}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
