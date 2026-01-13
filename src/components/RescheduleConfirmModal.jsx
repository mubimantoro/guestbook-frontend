import React from "react";
import { DateID } from "../utils/dateFormatter";

export default function RescheduleConfirmModal({
  show,
  onClose,
  onConfirm,
  data,
  loading,
}) {
  if (!show) return null;

  return (
    <>
      <div className="modal modal-blur fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bx bx-calendar-edit me-2"></i>
                Konfirmasi Penjadwalan Ulang
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-warning">
                <i className="bx bx-info-circle me-2"></i>
                Pastikan data yang Anda masukkan sudah benar sebelum melanjutkan
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Tamu</label>
                <div className="card bg-light">
                  <div className="card-body py-2">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-sm me-2">
                        {data.tamuNama?.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <div className="fw-bold">{data.tamuNama}</div>
                        <div className="text-muted small">
                          {data.tamuInstansi}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {data.jadwalLama && (
                <div className="mb-3">
                  <label className="form-label fw-bold text-danger">
                    <i className="bx bx-calendar-x me-1"></i>
                    Jadwal Lama
                  </label>
                  <div className="card border-danger">
                    <div className="card-body py-2">
                      <div className="text-decoration-line-through">
                        {DateID(new Date(data.jadwalLama))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-bold text-success">
                  <i className="bx bx-calendar-check me-1"></i>
                  Jadwal Baru
                </label>
                <div className="card border-success">
                  <div className="card-body py-2">
                    <div className="fw-bold">
                      {DateID(new Date(data.jadwalBaru))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  Alasan Penjadwalan Ulang
                </label>
                <div className="card bg-light">
                  <div className="card-body py-2">
                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {data.alasan}
                    </p>
                  </div>
                </div>
              </div>

              {data.sendWhatsApp && (
                <div className="alert alert-success mb-0">
                  <div className="d-flex">
                    <div>
                      <i className="bx bxl-whatsapp fs-2 me-2"></i>
                    </div>
                    <div>
                      <strong>Notifikasi WhatsApp akan dikirim</strong>
                      <p className="mb-0 small mt-1">
                        Tamu akan menerima notifikasi perubahan jadwal melalui
                        WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-link link-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Memproses...
                  </>
                ) : (
                  <>
                    <i className="bx bx-check me-2"></i>
                    Ya, Jadwalkan Ulang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
