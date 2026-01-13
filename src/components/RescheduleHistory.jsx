import React from "react";
import { DateID, DateShort } from "../utils/dateFormatter";

export default function RescheduleHistory({ histories, loading }) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!histories || histories.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">
          <i className="bx bx-calendar-x" style={{ fontSize: "3rem" }}></i>
        </div>
        <p className="empty-title">Belum Ada Riwayat Penjadwalan Ulang</p>
        <p className="empty-subtitle text-muted">
          Tamu ini belum pernah melakukan penjadwalan ulang
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "bg-warning", icon: "bx-time", text: "Menunggu" },
      confirmed: {
        class: "bg-success",
        icon: "bx-check",
        text: "Dikonfirmasi",
      },
      cancelled: { class: "bg-danger", icon: "bx-x", text: "Dibatalkan" },
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <i className="bx bx-history me-2"></i>
          Riwayat Penjadwalan Ulang
          <span className="badge bg-blue-lt ms-2">{histories.length}x</span>
        </h3>
      </div>
      <div className="card-body">
        <div className="timeline">
          {histories.map((history, index) => {
            const statusBadge = getStatusBadge(history.status);
            return (
              <div className="timeline-item" key={history.id}>
                <div className="timeline-badge bg-blue">
                  <i className="bx bx-calendar-edit"></i>
                </div>
                <div className="timeline-content">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h4 className="mb-1">
                        Penjadwalan Ulang #{histories.length - index}
                      </h4>
                      <small className="text-muted">
                        <i className="bx bx-time-five me-1"></i>
                        {DateID(new Date(history.created_at))}
                      </small>
                    </div>
                    <span className={`badge ${statusBadge.class}`}>
                      <i className={`bx ${statusBadge.icon} me-1`}></i>
                      {statusBadge.text}
                    </span>
                  </div>

                  <div className="row g-3 mb-3">
                    {history.jadwal_lama && (
                      <div className="col-md-6">
                        <div className="card bg-light mb-0">
                          <div className="card-body py-2">
                            <div className="text-muted small mb-1">
                              Jadwal Lama
                            </div>
                            <div className="fw-bold text-danger">
                              <i className="bx bx-calendar-x me-1"></i>
                              {DateShort(new Date(history.jadwal_lama))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-md-6">
                      <div className="card bg-light mb-0">
                        <div className="card-body py-2">
                          <div className="text-muted small mb-1">
                            Jadwal Baru
                          </div>
                          <div className="fw-bold text-success">
                            <i className="bx bx-calendar-check me-1"></i>
                            {DateShort(new Date(history.jadwal_baru))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info mb-2 py-2">
                    <div className="d-flex">
                      <div>
                        <i className="bx bx-info-circle me-2"></i>
                      </div>
                      <div>
                        <strong>Alasan:</strong>
                        <p className="mb-0 mt-1">{history.alasan_reschedule}</p>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      <i className="bx bx-user me-1"></i>
                      Oleh:{" "}
                      <strong>
                        {history.reschedule_by?.nama_lengkap || "System"}
                      </strong>
                    </div>
                    {history.whatsapp_sent && (
                      <span className="badge bg-success-lt">
                        <i className="bx bxl-whatsapp me-1"></i>
                        WhatsApp Terkirim
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
