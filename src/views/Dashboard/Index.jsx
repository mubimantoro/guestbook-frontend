import { useEffect, useState } from "react";
import PaginationComponent from "../../components/Pagination";
import LayoutAdmin from "../../layouts/Admin";
import Cookies from "js-cookie";
import Api from "../../services/Api";
import TamuDetail from "./Tamu/Detail";
import { Link } from "react-router-dom";

export default function Dashboard() {
  document.title = "Dashboard - Buku Tamu Digital";
  const [guests, setGuests] = useState([]);
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
      setGuests(response.data.data.data);

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-yellow", text: "Menunggu" },
      approved: { class: "bg-green", text: "Disetujui" },
      rejected: { class: "bg-red", text: "Ditolak" },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status,
    };

    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">Dashboard</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-12 mb-3">
              {/* <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="search by Nama Tamu"
                />
                {searching ? (
                  <button
                    onClick={searchHandlder}
                    className="btn btn-md btn-primary"
                  >
                    SEARCHING...
                  </button>
                ) : (
                  ""
                )}
              </div> */}
            </div>
            <div className="col-12">
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-vcenter table-mobile-md card-table">
                    <thead>
                      <tr>
                        <th>Nama Tamu</th>
                        <th>Instansi</th>
                        <th>Tujuan</th>
                        <th>Status</th>
                        <th className="w-1">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.length > 0 ? (
                        guests.map((item, index) => (
                          <tr key={index}>
                            <td data-label="Nama Lengkap">
                              {item.nama_lengkap}
                            </td>
                            <td data-label="Instansi">{item.instansi}</td>
                            <td data-label="Tujuan Kunjungan">
                              {item.kategori_kunjungan.nama}
                            </td>
                            <td data-label="Status">
                              {getStatusBadge(item.status)}
                            </td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <Link
                                  to={`/tamu/detail/${item.id}`}
                                  className="btn rounded"
                                >
                                  Detail
                                </Link>
                                {/* <DeleteButton
                                  id={product.id}
                                  endpoint="/api/products"
                                  fetchData={fetchData}
                                /> */}
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
