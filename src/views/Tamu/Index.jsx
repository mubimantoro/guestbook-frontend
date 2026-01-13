import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Api from "../../services/Api";
import { Link } from "react-router-dom";
import PaginationComponent from "../../components/Pagination";
import LayoutAdmin from "../../layouts/Admin";
import { getStatusBadge } from "../../utils/TamuStatus";
import toast from "react-hot-toast";
import ExportButton from "../../components/ExportButton";

export default function TamuIndex() {
  document.title = "Daftar Tamu - Buku Tamu Digital";

  const [tamu, setTamu] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [tanggalDari, setTanggalDari] = useState("");
  const [tanggalSampai, setTanggalSampai] = useState("");
  const [filtering, setFiltering] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  const token = Cookies.get("token");

  const fetchData = async (
    pageNumber = 1,
    search = "",
    dateFrom = "",
    dateTo = ""
  ) => {
    setFiltering(true);

    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (dateFrom) params.append("tanggal_dari", dateFrom);
      if (dateTo) params.append("tanggal_sampai", dateTo);
      params.append("page", pageNumber);

      const response = await Api.get(`/api/tamu?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTamu(response.data.data.data);
      setPagination({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFiltering(false);
    }
  };

  const handleExportDataPengunjung = async () => {
    setExportLoading(true);
    setShowExportDropdown(false);

    try {
      const params = new URLSearchParams({
        tanggal_dari: tanggalDari || "",
        tanggal_sampai: tanggalSampai || "",
        status: "",
        kategori_kunjungan_id: "",
        penanggung_jawab_id: "",
      });

      const response = await Api.get(
        `/api/tamu/export/data-pengunjung?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `data_pengunjung_${new Date().getTime()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Data pengunjung berhasil diexport!", {
        position: "top-right",
        duration: 4000,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal export data pengunjung");
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportIndeksKepuasan = async () => {
    setExportLoading(true);
    setShowExportDropdown(false);

    try {
      const params = new URLSearchParams({
        tanggal_dari: tanggalDari || "",
        tanggal_sampai: tanggalSampai || "",
        kategori_kunjungan_id: "",
        penanggung_jawab_id: "",
      });

      const response = await Api.get(
        `/api/tamu/export/indeks-kepuasan?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `indeks_kepuasan_${new Date().getTime()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Indeks kepuasan berhasil diexport!", {
        position: "top-right",
        duration: 4000,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal export indeks kepuasan");
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keywords !== undefined) {
        fetchData(1, keywords, tanggalDari, tanggalSampai);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keywords]);

  const handleSearchChange = (e) => {
    setKeywords(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData(1, keywords, tanggalDari, tanggalSampai);
  };

  const handleResetFilter = () => {
    setKeywords("");
    setTanggalDari("");
    setTanggalSampai("");
    fetchData(1, "", "", "");
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

  const isFilterActive = keywords || tanggalDari || tanggalSampai;

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">Tamu</h2>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="d-flex gap-2">
                {/* Export Dropdown */}
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-success dropdown-toggle"
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    disabled={exportLoading}
                  >
                    {exportLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-download me-2"></i>
                        Export Excel
                      </>
                    )}
                  </button>
                  {showExportDropdown && (
                    <div className="dropdown-menu dropdown-menu-end show">
                      <button
                        className="dropdown-item"
                        onClick={handleExportDataPengunjung}
                      >
                        <i className="bx bx-user me-2"></i>
                        Data Pengunjung
                      </button>
                      <button
                        className="dropdown-item"
                        onClick={handleExportIndeksKepuasan}
                      >
                        <i className="bx bx-bar-chart me-2"></i>
                        Indeks Kepuasan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-12">
              <div className="card mb-3">
                <div className="card-body">
                  <form onSubmit={handleFilterSubmit}>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Cari Nama/Instansi/Kode
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ketik untuk mencari..."
                          value={keywords}
                          onChange={handleSearchChange}
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Tanggal Dari</label>
                        <input
                          type="date"
                          className="form-control"
                          value={tanggalDari}
                          onChange={(e) => setTanggalDari(e.target.value)}
                          max={tanggalSampai || undefined}
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Tanggal Sampai</label>
                        <input
                          type="date"
                          className="form-control"
                          value={tanggalSampai}
                          onChange={(e) => setTanggalSampai(e.target.value)}
                          min={tanggalDari || undefined}
                        />
                      </div>

                      <div className="col-md-2">
                        <label className="form-label">&nbsp;</label>
                        <div className="d-flex gap-2">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={filtering}
                          >
                            {filtering ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Filter
                              </>
                            ) : (
                              <>
                                <i className="bx bx-filter-alt me-1"></i>
                                Filter
                              </>
                            )}
                          </button>
                          {isFilterActive && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={handleResetFilter}
                            >
                              <i className="bx bx-reset"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Table Card */}
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-vcenter table-mobile-md card-table">
                    <thead>
                      <tr>
                        <th>ID Kunjungan</th>
                        <th>Nama Tamu</th>
                        <th>Instansi</th>
                        <th>Tujuan</th>
                        <th>Status</th>
                        <th className="w-1">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtering ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <p className="mt-2 mb-0 text-muted">
                              Memuat data...
                            </p>
                          </td>
                        </tr>
                      ) : tamu.length > 0 ? (
                        tamu.map((item, index) => (
                          <tr key={index}>
                            <td data-label="ID Kunjungan">
                              {item.kode_kunjungan}
                            </td>
                            <td data-label="Nama Lengkap">
                              {item.nama_lengkap}
                            </td>
                            <td data-label="Instansi">{item.instansi}</td>
                            <td data-label="Tujuan Kunjungan">
                              {item.kategori_kunjungan.nama}
                            </td>
                            <td data-label="Status">
                              {renderStatusBadge(item.status)}
                            </td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <Link
                                  to={`/tamu/${item.id}`}
                                  className="btn rounded"
                                >
                                  Detail
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            <div className="alert alert-info mb-0">
                              {isFilterActive
                                ? "Tidak ada data yang sesuai dengan filter"
                                : "Data Belum Tersedia!"}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {tamu.length > 0 && (
                    <PaginationComponent
                      currentPage={pagination.currentPage}
                      perPage={pagination.perPage}
                      total={pagination.total}
                      onChange={(pageNumber) =>
                        fetchData(
                          pageNumber,
                          keywords,
                          tanggalDari,
                          tanggalSampai
                        )
                      }
                      position="end"
                    />
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
