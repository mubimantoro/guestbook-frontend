import LayoutAdmin from "../../layouts/Admin";

export default function Dashboard() {
  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">Halaman</div>
              <h2 className="page-title">Dashboard</h2>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
