import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore as useThemeStore } from "../stores/theme";
import { useStore as useUserStore } from "../stores/user";

export default function Header() {
  const { theme, changeTheme } = useThemeStore();

  const { user, logout } = useUserStore();

  const location = useLocation();

  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    return navigate("/");
  };

  return (
    <div className="sticky-top">
      <header className="navbar navbar-expand-md d-print-none sticky-top">
        <div className="container-xl">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbar-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3 mt-1">
            <Link to={"/"}>
              <img
                src="/images/logo.webp"
                width="100"
                height="32"
                alt="Tabler"
                className="navbar-brand-image mb-2"
              />
              <label className="ms-2">Buku Tamu Digital</label>
            </Link>
          </h1>
          <div className="navbar-nav flex-row order-md-last">
            <div className="d-none d-md-flex me-2">
              {theme === "dark" ? (
                <button
                  onClick={changeTheme}
                  className="nav-link px-0"
                  title="Enable light mode"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
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
                    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                    <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={changeTheme}
                  className="nav-link px-0"
                  title="Enable dark mode"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
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
                    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu"
              >
                <span
                  className="avatar avatar-sm"
                  style={{ backgroundImage: "url(/images/boy.png)" }}
                ></span>
                <div className="d-none d-xl-block ps-2">
                  <div>{user?.name}</div>
                  <div className="mt-1 small text-muted">{user?.email}</div>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow rounded mt-3">
                <Link to={`/users/${user?.id}`} className="dropdown-item">
                  Profile
                </Link>
                <div className="dropdown-divider"></div>
                <a href="#" onClick={logoutHandler} className="dropdown-item">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar bg-muted-lt">
            <div className="container-xl">
              <ul className="navbar-nav">
                <li
                  className={`nav-item ${
                    location.pathname === "/dashboard" ? "active" : ""
                  }`}
                >
                  <Link className="nav-link" to="/dashboard">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
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
                        <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                      </svg>
                    </span>
                    <span className="nav-link-title">HOME</span>
                  </Link>
                </li>
                <li
                  className={`nav-item dropdown ${
                    location.pathname === "/kategori-kunjungan" ? "active" : ""
                  }`}
                >
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    role="button"
                    aria-expanded="false"
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
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
                        className="icon icon-tabler icons-tabler-outline icon-tabler-box"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                        <path d="M12 12l8 -4.5" />
                        <path d="M12 12l0 9" />
                        <path d="M12 12l-8 -4.5" />
                      </svg>
                    </span>
                    <span className="nav-link-title">MASTER</span>
                  </a>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="/kategori-kunjungan">
                      Kategori Kunjungan
                    </Link>
                  </div>
                </li>

                <li
                  className={`nav-item dropdown ${
                    location.pathname === "/roles" ||
                    location.pathname === "/users"
                      ? "active"
                      : ""
                  }`}
                >
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    role="button"
                    aria-expanded="false"
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
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
                        className="icon icon-tabler icons-tabler-outline icon-tabler-user-shield"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h2" />
                        <path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z" />
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                      </svg>
                    </span>
                    <span className="nav-link-title">Users</span>
                  </a>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="/roles">
                      Roles
                    </Link>
                    <Link className="dropdown-item" to="/users">
                      Users
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
