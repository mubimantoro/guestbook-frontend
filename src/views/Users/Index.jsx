import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LayoutAdmin from "../../layouts/Admin";
import PaginationComponent from "../../components/Pagination";
import Api from "../../services/Api";
import { Link } from "react-router-dom";
import DeleteButton from "../../components/DeleteButton";

export default function UsersIndex() {
  document.title = "Users - Buku Tamu Digital";
  const [users, setUsers] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [searching, setSearching] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0,
  });

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1, keywords = "") => {
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/users?search=${keywords}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setUsers(response.data.data.data);

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

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">Users</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-12 mb-3">
              <Link
                to="/users/create"
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
                        <th>Nama Lengkap</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th className="w-1">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((item, index) => (
                          <tr key={index}>
                            <td data-label="Nama Lengkap">
                              {item.nama_lengkap}
                            </td>
                            <td data-label="Username">{item.username}</td>
                            <td data-label="Email">{item.email}</td>
                            <td>
                              {item.roles.map((role, index) => (
                                <span
                                  className="badge bg-success shadow-sm border-0 ms-2 mb-2 fw-normal rounded"
                                  key={index}
                                >
                                  {role.name}
                                </span>
                              ))}
                            </td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <Link
                                  to={`/users/edit/${item.id}`}
                                  className="btn rounded"
                                >
                                  Edit
                                </Link>
                                <DeleteButton
                                  id={item.id}
                                  endpoint="/api/users"
                                  fetchData={fetchData}
                                />
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
