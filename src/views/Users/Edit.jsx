import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import LayoutAdmin from "../../layouts/Admin";
import Api from "../../services/Api";

export default function UsersEdit() {
  document.title = "Edit Users - Buku Tamu Digital";

  const navigate = useNavigate();
  const { id } = useParams();

  const [namaLengkap, setNamaLengkap] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const [errors, setErrors] = useState([]);

  const [roles, setRoles] = useState([]);

  const token = Cookies.get("token");

  const fetchDataRole = async () => {
    await Api.get(`/api/roles/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setRoles(response.data.data);
    });
  };

  const fetchDataUser = async () => {
    await Api.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setNamaLengkap(response.data.data.nama_lengkap);
      setNomorHp(response.data.data.nomor_hp);
      setUsername(response.data.data.username);
      setEmail(response.data.data.email);
      setRolesData(response.data.data.roles.map((obj) => obj.name));
    });
  };

  useEffect(() => {
    fetchDataRole();
    fetchDataUser();
  }, []);

  const handleCheckboxChange = (e) => {
    let data = rolesData;

    if (data.some((name) => name === e.target.value)) {
      data = data.filter((name) => name !== e.target.value);
    } else {
      data.push(e.target.value);
    }

    setRolesData(data);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    await Api.put(
      `/api/users/${id}`,
      {
        nama_lengkap: namaLengkap,
        nomor_hp: nomorHp,
        username: username,
        email: email,
        password: password,
        roles: rolesData,
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
        navigate("/users");
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
              <Link to="/users" className="btn btn-primary">
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
              <form onSubmit={updateUser}>
                <div className="card-header">
                  <h4 className="card-title">Edit Data</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label required">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={namaLengkap}
                          onChange={(e) => setNamaLengkap(e.target.value)}
                          placeholder="Masukkan Nama lengkap"
                        />
                        {errors.nama_lengkap && (
                          <div className="alert alert-danger mt-2">
                            {errors.nama_lengkap[0]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label required">Nomor HP</label>
                        <input
                          type="text"
                          className="form-control"
                          value={nomorHp}
                          onChange={(e) => setNomorHp(e.target.value)}
                          placeholder="Masukkan Nomor HP"
                        />
                        <small class="form-hint">
                          Pastikan nomor terhubung dengan WhatsApp
                        </small>
                        {errors.nomor_hp && (
                          <div className="alert alert-danger mt-2">
                            {errors.nomor_hp[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label required">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Masukkan Username"
                        />
                        {errors.username && (
                          <div className="alert alert-danger mt-2">
                            {errors.username[0]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label required">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Masukkan Email"
                        />
                        {errors.email && (
                          <div className="alert alert-danger mt-2">
                            {errors.email[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label required">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan Password"
                        />
                        {errors.password && (
                          <div className="alert alert-danger mt-2">
                            {errors.password[0]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label required">Roles</label>
                        <div className="form-selectgroup">
                          {roles.map((role) => (
                            <label
                              className="form-selectgroup-item"
                              key={role.id}
                            >
                              <input
                                type="checkbox"
                                value={role.name}
                                className="form-selectgroup-input"
                                onChange={handleCheckboxChange}
                              />
                              <span className="form-selectgroup-label">
                                {role.name}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.roles && (
                          <div className="alert alert-danger mt-2">
                            {errors.roles[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn me-2 rounded"
                    onClick={() => navigate("/users")}
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
                    Perbarui
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
