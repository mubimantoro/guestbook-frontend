import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LayoutAdmin from "../../layouts/Admin";
import PaginationComponent from "../../components/Pagination";
import Api from "../../services/Api";
import DeleteButton from "../../components/DeleteButton";
import { Link } from "react-router-dom";

export default function KategoriKunjunganIndex() {
  document.title = "Kategori Kunjungan - Buku Tamu Digital";
  const [kategoriKunjungan, setKategoriKunjungan] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1) => {
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/kategori-kunjungan?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setKategoriKunjungan(response.data.data.data);
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
              <h2 className="page-title">Kategori Kunjungan</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-12 mb-3">
              <Link
                to="/kategori-kunjungan/create"
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
                        <th>Nama</th>
                        <th className="w-1">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kategoriKunjungan.length > 0 ? (
                        kategoriKunjungan.map((item, index) => (
                          <tr key={index}>
                            <td data-label="Nama">{item.nama}</td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <Link
                                  to={`/kategori-kunjungan/edit/${item.id}`}
                                  className="btn rounded"
                                >
                                  Edit
                                </Link>
                                <DeleteButton
                                  id={item.id}
                                  endpoint="/api/kategori-kunjungan"
                                  fetchData={fetchData}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">
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
