import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";
import toast from "react-hot-toast";
import Api from "../../services/Api";
import Cookies from "js-cookie";

export default function Login() {
  document.title = "Login - Buku Tamu";
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState([]);

  const loginHandler = async (e) => {
    e.preventDefault();

    await Api.post("/api/login", {
      login: login,
      password: password,
    })
      .then((response) => {
        Cookies.set("token", response.data.token);
        Cookies.set("user", JSON.stringify(response.data.user));
        Cookies.set("permissions", JSON.stringify(response.data.permissions));

        toast.success("Login Successfully!", {
          position: "top-right",
          duration: 4000,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  if (Cookies.get("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LayoutAuth>
      <div className="text-center mb-4 mt-5">
        <a href="/" className="navbar-brand navbar-brand-autodark p-4">
          <img src="/images/logo_kgtk.webp" width={"100"} alt="" />
        </a>
        <br />
        <h2 className="mt-3">Buku Tamu Digital KGTK Gorontalo</h2>
      </div>
      <div className="card card-md rounded">
        <div className="card-body">
          <h2 className="h2 text-center mb-4">Login ke Akun Anda</h2>
          {errors.message && (
            <div className="alert alert-danger mt-2">{errors.message}</div>
          )}
          <form onSubmit={loginHandler} autoComplete="off">
            <div className="mb-3">
              <label className="form-label">Email / Username</label>
              <input
                type="text"
                className="form-control"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Email / Username"
                autoComplete="off"
              />
              {errors.login && (
                <div className="alert alert-danger mt-2">{errors.login}</div>
              )}
            </div>
            <div className="mb-2">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="off"
              />
              {errors.password && (
                <div className="alert alert-danger mt-2">{errors.password}</div>
              )}
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary w-100 rounded">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
