import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Api from "../../services/Api";
import { Link } from "react-router-dom";
import PaginationComponent from "../../components/Pagination";
import LayoutAdmin from "../../layouts/Admin";
import { getStatusBadge } from "../../utils/TamuStatus";

export default function TamuIndex() {
  document.title = "Daftar Tamu - Buku Tamu Digital";
  const [tamu, setTamu] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [searching, setSearching] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1) => {
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/tamu?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setTamu(response.data.data.data);

      setPagination(() => ({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
      }));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchHandlder = () => {
    fetchData(1, keywords);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchHandlder();
    }
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
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">Tamu</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-12">
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
                      {tamu.length > 0 ? (
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
                            <div className="alert alert-danger mb-0">
                              Data Belum Tersedia!
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <PaginationComponent
                    currentPage={pagination.currentPage}
                    perPage={pagination.perPage}
                    total={pagination.total}
                    onChange={(pageNumber) => fetchData(pageNumber, keywords)}
                    position="end"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
