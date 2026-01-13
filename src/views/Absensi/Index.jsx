import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import LayoutAdmin from "../../layouts/Admin";
import Api from "../../services/Api";

export default function AbsensiIndex() {
  document.title = "Absensi Staff - Buku Tamu Digital";

  const [penanggungJawabList, setPenanggungJawabList] = useState([]);
  const [kategoriKunjunganList, setKategoriKunjunganList] = useState([]);
  const [absensiData, setAbsensiData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedKategori, setSelectedKategori] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const token = Cookies.get("token");

  // Fetch Kategori Kunjungan
  const fetchKategoriKunjungan = async () => {
    try {
      const response = await Api.get("/api/kategori-kunjungan?per_page=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKategoriKunjunganList(response.data.data.data);
    } catch (error) {
      console.error("Error fetching kategori:", error);
    }
  };

  // Fetch Penanggung Jawab
  const fetchPenanggungJawab = async () => {
    try {
      const url = selectedKategori
        ? `/api/penanggung-jawab?kategori_kunjungan_id=${selectedKategori}&per_page=100`
        : "/api/penanggung-jawab?per_page=100";

      const response = await Api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPenanggungJawabList(response.data.data.data);
    } catch (error) {
      console.error("Error fetching penanggung jawab:", error);
      toast.error("Gagal memuat data staff");
    }
  };

  // Fetch Absensi berdasarkan tanggal
  const fetchAbsensi = async () => {
    setLoading(true);
    try {
      const response = await Api.get(
        `/api/absensi?tanggal=${selectedDate}&per_page=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const absensiRecords = response.data.data.data;

      // Merge penanggung jawab dengan data absensi
      const mergedData = penanggungJawabList.map((pj) => {
        const existingAbsensi = absensiRecords.find(
          (abs) => abs.penanggung_jawab_id === pj.id
        );

        return {
          penanggung_jawab_id: pj.id,
          nama: pj.user?.name || pj.nama || "-",
          kategori: pj.kategori_kunjungan?.nama || "-",
          status: existingAbsensi?.status || "",
          absensi_id: existingAbsensi?.id || null,
        };
      });

      setAbsensiData(mergedData);
    } catch (error) {
      console.error("Error fetching absensi:", error);
      toast.error("Gagal memuat data absensi");
    } finally {
      setLoading(false);
    }
  };

  // Handle perubahan status
  const handleStatusChange = (penanggungJawabId, newStatus) => {
    setAbsensiData((prev) =>
      prev.map((item) =>
        item.penanggung_jawab_id === penanggungJawabId
          ? { ...item, status: newStatus }
          : item
      )
    );
    setHasChanges(true);
  };

  // Simpan semua absensi (Bulk)
  const handleBulkSave = async () => {
    // Filter hanya yang memiliki status
    const absensisToSave = absensiData
      .filter((item) => item.status !== "")
      .map((item) => ({
        penanggung_jawab_id: item.penanggung_jawab_id,
        tanggal: selectedDate,
        status: item.status,
      }));

    if (absensisToSave.length === 0) {
      toast.error("Tidak ada data yang perlu disimpan");
      return;
    }

    setSaving(true);
    try {
      const response = await Api.post(
        "/api/absensi/bulk",
        { absensis: absensisToSave },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        `Berhasil: ${response.data.data.created} dibuat, ${response.data.data.updated} diupdate`,
        {
          position: "top-right",
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }
      );

      setHasChanges(false);
      fetchAbsensi(); // Refresh data
    } catch (error) {
      console.error("Error saving absensi:", error);
      toast.error("Gagal menyimpan data absensi");
    } finally {
      setSaving(false);
    }
  };

  // Tandai semua hadir
  const handleMarkAllPresent = () => {
    setAbsensiData((prev) =>
      prev.map((item) => ({ ...item, status: "hadir" }))
    );
    setHasChanges(true);
  };

  // Reset perubahan
  const handleReset = () => {
    fetchAbsensi();
    setHasChanges(false);
  };

  useEffect(() => {
    fetchKategoriKunjungan();
  }, []);

  useEffect(() => {
    fetchPenanggungJawab();
  }, [selectedKategori]);

  useEffect(() => {
    if (penanggungJawabList.length > 0) {
      fetchAbsensi();
    }
  }, [selectedDate, penanggungJawabList]);

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">Absensi Staff</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            {/* Filter Section */}
            <div className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Tanggal</label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        Filter Kategori (Opsional)
                      </label>
                      <select
                        className="form-select"
                        value={selectedKategori}
                        onChange={(e) => setSelectedKategori(e.target.value)}
                      >
                        <option value="">Semua Kategori</option>
                        {kategoriKunjunganList.map((kategori) => (
                          <option key={kategori.id} value={kategori.id}>
                            {kategori.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      <button
                        className="btn btn-primary rounded me-2"
                        onClick={handleMarkAllPresent}
                        disabled={loading}
                      >
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
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Tandai Semua Hadir
                      </button>
                      <button
                        className="btn btn-secondary rounded"
                        onClick={handleReset}
                        disabled={loading || !hasChanges}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Daftar Absensi - {selectedDate}
                  </h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-vcenter table-mobile-md card-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Staff</th>
                        <th>Kategori</th>
                        <th className="text-center">Status Kehadiran</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : absensiData.length > 0 ? (
                        absensiData.map((item, index) => (
                          <tr key={item.penanggung_jawab_id}>
                            <td data-label="No">{index + 1}</td>
                            <td data-label="Nama">{item.nama}</td>
                            <td data-label="Kategori">{item.kategori}</td>
                            <td data-label="Status">
                              <div className="d-flex justify-content-center gap-2">
                                <label className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`status-${item.penanggung_jawab_id}`}
                                    checked={item.status === "hadir"}
                                    onChange={() =>
                                      handleStatusChange(
                                        item.penanggung_jawab_id,
                                        "hadir"
                                      )
                                    }
                                  />
                                  <span className="form-check-label">
                                    Hadir
                                  </span>
                                </label>
                                <label className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`status-${item.penanggung_jawab_id}`}
                                    checked={item.status === "tidak hadir"}
                                    onChange={() =>
                                      handleStatusChange(
                                        item.penanggung_jawab_id,
                                        "tidak hadir"
                                      )
                                    }
                                  />
                                  <span className="form-check-label">
                                    Tidak Hadir
                                  </span>
                                </label>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            <div className="alert alert-info mb-0">
                              Tidak ada data staff. Silakan tambah penanggung
                              jawab terlebih dahulu.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-success rounded"
                    onClick={handleBulkSave}
                    disabled={!hasChanges || saving || loading}
                  >
                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Menyimpan...
                      </>
                    ) : (
                      <>
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
                          className="me-1"
                        >
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Simpan Semua Absensi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
