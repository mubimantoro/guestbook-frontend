import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../views/auth/Login";
import { useStore } from "../stores/user";
import Dashboard from "../views/dashboard/Index";
import PrivateRoutes from "./PrivateRoutes";

export default function AppRoutes() {
  const { token } = useStore();

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        }
      />
    </Routes>
  );
}
