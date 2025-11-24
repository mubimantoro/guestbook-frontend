import { useState } from "react";
import Cookies from "js-cookie";
import Api from "../../services/Api";
import toast from "react-hot-toast";
import LayoutAdmin from "../../layouts/Admin";
import { Link, useNavigate } from "react-router-dom";

export default function KategoriKunjunganCreate() {
  document.title = "Tambah Kategori Kunjungan - Buku Tamu Digital";

  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [errors, setErrors] = useState([]);

  const token = Cookies.get("token");

  const storeKategoriKunjungan = async (e) => {
    e.preventDefault();

    await Api.post(
      "/api/kategori-kunjungan",
      {
        nama: nama,
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
        navigate("/kategori-kunjungan");
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
              <Link
                to="/kategori-kunjungan"
                className="btn btn-primary rounded"
              >
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
              <form onSubmit={storeKategoriKunjungan}>
                <div className="card-header">
                  <h4 className="card-title">Tambah Data</h4>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Nama Kategori Kunjungan
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan Nama"
                    />
                    {errors.nama && (
                      <div className="alert alert-danger mt-2">
                        {errors.nama[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn me-2 rounded"
                    onClick={() => navigate("/kategori-kunjungan")}
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
