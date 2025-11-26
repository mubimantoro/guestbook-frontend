import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import LayoutAdmin from "../../layouts/Admin";
import Api from "../../services/Api";

export default function PenanggungJawabCreate() {
  document.title = "Tambah Penanggung Jawab - Buku Tamu Digital";

  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [kategoriKunjunganId, setKategoriKunjunganId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState([]);

  const [users, setUsers] = useState([]);
  const [kategoriKunjungan, setKategoriKunjungan] = useState([]);

  const token = Cookies.get("token");

  const fetchUsers = async () => {
    await Api.get("/api/users/role/pic", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setUsers(response.data.data);
    });
  };

  const fetchKategoriKunjungan = async () => {
    await Api.get("/api/kategori-kunjungan/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setKategoriKunjungan(response.data.data);
    });
  };

  useEffect(() => {
    fetchUsers();
    fetchKategoriKunjungan();
  }, []);

  const storePenanggungJawab = async (e) => {
    e.preventDefault();

    await Api.post(
      "/api/penanggung-jawab",
      {
        user_id: userId,
        kategori_kunjungan_id: kategoriKunjunganId,
        is_active: isActive,
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

        navigate("/penanggung-jawab");
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
              <Link to="/penanggung-jawab" className="btn btn-primary">
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
                  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"
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
              <form onSubmit={storePenanggungJawab}>
                <div className="card-header">
                  <h4 className="card-title">Tambah Data</h4>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">User</label>
                    <select
                      className="form-select"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    >
                      <option value="">-- Pilih User --</option>
                      {users.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nama_lengkap}
                        </option>
                      ))}
                    </select>
                    {errors.user_id && (
                      <div className="alert alert-danger mt-2">
                        {errors.user_id[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">PJ Kunjungan</label>
                    <select
                      className="form-select"
                      value={kategoriKunjunganId}
                      onChange={(e) => setKategoriKunjunganId(e.target.value)}
                    >
                      <option value="">-- Pilih Kategori Kunjungan --</option>
                      {kategoriKunjungan.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nama}
                        </option>
                      ))}
                    </select>
                    {errors.kategori_kunjungan_id && (
                      <div className="alert alert-danger mt-2">
                        {errors.kategori_kunjungan_id[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <div>
                      <label className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          checked={isActive === true}
                          onChange={() => setIsActive(true)}
                        />
                        <span className="form-check-label">Aktif</span>
                      </label>
                      <label className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          checked={isActive === false}
                          onChange={() => setIsActive(false)}
                        />
                        <span className="form-check-label">Tidak Aktif</span>
                      </label>
                    </div>
                    {errors.is_active && (
                      <div className="alert alert-danger mt-2">
                        {errors.is_active[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn me-2 rounded"
                    onClick={() => navigate("/penanggung-jawab")}
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
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
