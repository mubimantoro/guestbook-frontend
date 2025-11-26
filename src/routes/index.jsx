import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../views/Auth/Login";
import { useStore } from "../stores/user";
import Dashboard from "../views/Dashboard/Index";
import PrivateRoutes from "./PrivateRoutes";
import KategoriKunjunganIndex from "../views/kategoriKunjungan/Index";
import RolesIndex from "../views/Roles/Index";
import UsersIndex from "../views/Users/Index";
import KategoriKunjunganCreate from "../views/kategoriKunjungan/Create";
import KategoriKunjunganEdit from "../views/kategoriKunjungan/Edit";
import RolesCreate from "../views/Roles/Create";
import RolesEdit from "../views/Roles/Edit";
import UsersCreate from "../views/Users/Create";
import UsersEdit from "../views/Users/Edit";
import FormTamu from "../views/Public/Guest/Index";
import TamuDetail from "../views/Dashboard/Tamu/Detail";
import PenanggungJawabIndex from "../views/PenanggungJawab/Index";
import PenanggungJawabCreate from "../views/PenanggungJawab/Create";
import PenanggungJawabEdit from "../views/PenanggungJawab/Edit";
import PermissionsIndex from "../views/Permissions/Index";

export default function AppRoutes() {
  const { token } = useStore();

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/guest" element={<FormTamu />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        }
      />

      <Route
        path="/kategori-kunjungan"
        element={
          <PrivateRoutes>
            <KategoriKunjunganIndex />
          </PrivateRoutes>
        }
      />

      <Route
        path="/kategori-kunjungan/create"
        element={
          <PrivateRoutes>
            <KategoriKunjunganCreate />
          </PrivateRoutes>
        }
      />

      <Route
        path="/kategori-kunjungan/edit/:id"
        element={
          <PrivateRoutes>
            <KategoriKunjunganEdit />
          </PrivateRoutes>
        }
      />

      <Route
        path="/roles"
        element={
          <PrivateRoutes>
            <RolesIndex />
          </PrivateRoutes>
        }
      />

      <Route
        path="/roles/create"
        element={
          <PrivateRoutes>
            <RolesCreate />
          </PrivateRoutes>
        }
      />

      <Route
        path="/roles/edit/:id"
        element={
          <PrivateRoutes>
            <RolesEdit />
          </PrivateRoutes>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoutes>
            <UsersIndex />
          </PrivateRoutes>
        }
      />

      <Route
        path="/users/create"
        element={
          <PrivateRoutes>
            <UsersCreate />
          </PrivateRoutes>
        }
      />

      <Route
        path="/permissions"
        element={
          <PrivateRoutes>
            <PermissionsIndex />
          </PrivateRoutes>
        }
      />

      <Route
        path="/users/edit/:id"
        element={
          <PrivateRoutes>
            <UsersEdit />
          </PrivateRoutes>
        }
      />

      <Route
        path="/tamu/:id"
        element={
          <PrivateRoutes>
            <TamuDetail />
          </PrivateRoutes>
        }
      />

      <Route
        path="/penanggung-jawab/"
        element={
          <PrivateRoutes>
            <PenanggungJawabIndex />
          </PrivateRoutes>
        }
      />

      <Route
        path="/penanggung-jawab/create"
        element={
          <PrivateRoutes>
            <PenanggungJawabCreate />
          </PrivateRoutes>
        }
      />

      <Route
        path="/penanggung-jawab/edit/:id"
        element={
          <PrivateRoutes>
            <PenanggungJawabEdit />
          </PrivateRoutes>
        }
      />
    </Routes>
  );
}
