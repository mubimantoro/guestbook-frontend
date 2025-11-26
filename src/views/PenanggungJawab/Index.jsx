import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Api from "../../services/Api";
import LayoutAdmin from "../../layouts/Admin";
import PaginationComponent from "../../components/Pagination";
import { Link } from "react-router-dom";

export default function PenanggungJawabIndex() {
  document.title = "Penanggung Jawab - Buku Tamu Digital";
  const [penanggungJawab, setPenanggungJawab] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1) => {
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/penanggung-jawab?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPenanggungJawab(response.data.data.data);
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

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">Penanggung Jawab</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-12 mb-3">
              <Link
                to="/penanggung-jawab/create"
                className="btn btn-primary rounded"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
                Tambah Data
              </Link>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-vcenter table-mobile-md card-table">
                    <thead>
                      <tr>
                        <th>Nama User</th>
                        <th>PJ Kunjungan</th>
                        <th>Status PJ</th>
                        <th className="w-1">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {penanggungJawab.length > 0 ? (
                        penanggungJawab.map((item, index) => (
                          <tr key={index}>
                            <td data-label="Nama">{item.user.nama_lengkap}</td>
                            <td data-label="Kategori Kunjungan">
                              <span className="badge bg-blue-lt">
                                {item.kategori_kunjungan?.nama}
                              </span>
                            </td>
                            <td data-label="Status">
                              {item.is_active ? (
                                <span className="badge bg-success">Aktif</span>
                              ) : (
                                <span className="badge bg-danger">
                                  Tidak Aktif
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <Link
                                  to={`/penanggung-jawab/edit/${item.id}`}
                                  className="btn rounded"
                                >
                                  Edit
                                </Link>
                                {/* <DeleteButton
                                  id={item.id}
                                  endpoint="/api/penanggung-jawab"
                                  fetchData={fetchData}
                                /> */}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
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
                    onChange={(pageNumber) => fetchData(pageNumber)}
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
