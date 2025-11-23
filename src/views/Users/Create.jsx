import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import Api from "../../services/Api";
import toast from "react-hot-toast";

export default function UsersCreate({ fetchData }) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const [errors, setErrors] = useState([]);
  const modalRef = useRef(null);

  const [roles, setRoles] = useState([]);
  const token = Cookies.get("token");

  const fetchDataRoles = async () => {
    await Api.get("/api/roles/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setRoles(response.data.data);
    });
  };

  useEffect(() => {
    fetchDataRoles();
  }, []);

  const handleCheckboxChange = (e) => {
    let data = rolesData;
    data.push(e.target.value);
    setRolesData(data);
  };

  const storeUser = async (e) => {
    e.preventDefault();

    await Api.post(
      "/api/users",
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
          duration: 400,
        });

        const modalElement = modalRef.current;
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        fetchData();
        setNamaLengkap("");
        setNomorHp("");
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  return (
    <>
      <a
        href="#"
        className="btn btn-primary d-sm-inline-block"
        data-bs-toggle="modal"
        data-bs-target="#modal-create-user"
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
      </a>
      <div
        className="modal modal-blur fade"
        id="modal-create-user"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        ref={modalRef}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <form onSubmit={storeUser}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah Data</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Nama Lengkap</label>
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
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href="#"
                  className="btn me-auto rounded"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  className="btn btn-primary ms-auto rounded"
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
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
