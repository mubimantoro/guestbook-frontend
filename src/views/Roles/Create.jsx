import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LayoutAdmin from "../../layouts/Admin";
import Api from "../../services/Api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RolesCreate() {
  document.title = "Tambah Roles - Buku Tamu Digital";

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [permissionsData, setPermissionsData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const token = Cookies.get("token");

  const fetchDataPermissions = async () => {
    await Api.get("/api/permissions/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPermissions(response.data.data);
    });
  };

  useEffect(() => {
    fetchDataPermissions();
  }, []);

  const handleCheckboxChange = (e) => {
    let data = permissionsData;

    data.push(e.target.value);

    setPermissionsData(data);
  };

  const storeRole = async (e) => {
    e.preventDefault();

    await Api.post(
      "/api/roles",
      {
        name: name,
        permissions: permissionsData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-right",
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/roles");
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <Link to="/roles" className="btn btn-primary rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l14 0" />
                  <path d="M5 12l4 4" />
                  <path d="M5 12l4 -4" />
                </svg>
                Kembali
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row card">
            <div className="col-12">
              <form onSubmit={storeRole}>
                <div className="card-header">
                  <h4 className="card-title">Tambah Data</h4>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Nama Role</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan Nama Role"
                    />
                    {errors.name && (
                      <div className="alert alert-danger mt-2">
                        {errors.name[0]}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Permissions</label>
                    <div className="form-selectgroup form-selectgroup-boxes d-flex flex-column">
                      {permissions.map((permission) => (
                        <label
                          className="form-selectgroup-item flex-fill"
                          key={Math.random()}
                          htmlFor={`check-${permission.id}`}
                        >
                          <input
                            type="checkbox"
                            value={permission.name}
                            className="form-selectgroup-input"
                            onChange={handleCheckboxChange}
                            id={`check-${permission.id}`}
                          />
                          <div className="form-selectgroup-label d-flex align-items-center p-3">
                            <div className="me-3">
                              <span className="form-selectgroup-check"></span>
                            </div>
                            <div>
                              <strong>{permission.name}</strong>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.permissions && (
                      <div className="alert alert-danger mt-2">
                        {errors.permissions[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn me-2 rounded"
                    onClick={() => navigate("/roles")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                      <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M14 4l0 4l-6 0l0 -4" />
                    </svg>
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
