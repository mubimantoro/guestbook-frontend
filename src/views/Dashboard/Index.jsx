import { useEffect, useState } from "react";
import PaginationComponent from "../../components/Pagination";
import LayoutAdmin from "../../layouts/Admin";
import Cookies from "js-cookie";
import Api from "../../services/Api";
import { Link } from "react-router-dom";
import { getStatusBadge } from "../../utils/TamuStatus";
import ApexCharts from "apexcharts";

export default function Dashboard() {
  document.title = "Dashboard - Buku Tamu Digital";

  // State untuk statistik umum
  const [statistics, setStatistics] = useState({
    total_tamu: 0,
    total_kategori: 0,
    total_pic: 0,
    status_summary: {
      pending: 0,
      approved: 0,
      not_met: 0,
      completed: 0,
    },
    tamu_hari_ini: 0,
    tamu_minggu_ini: 0,
    tamu_bulan_ini: 0,
  });

  // State untuk chart data
  const [kunjunganPerKategori, setKunjunganPerKategori] = useState([]);
  const [kunjunganPerInstansi, setKunjunganPerInstansi] = useState([]);
  const [trendBulanan, setTrendBulanan] = useState([]);
  const [distribusiStatus, setDistribusiStatus] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [perbandinganPeriode, setPerbandinganPeriode] = useState(null);

  const token = Cookies.get("token");

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      // Fetch statistik umum
      const statsResponse = await Api.get("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatistics(statsResponse.data.data);

      // Fetch kunjungan per kategori
      const kategoriResponse = await Api.get(
        "/api/dashboard/kunjungan-per-kategori",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setKunjunganPerKategori(kategoriResponse.data.data);

      // Fetch kunjungan per instansi
      const instansiResponse = await Api.get(
        "/api/dashboard/kunjungan-per-instansi",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setKunjunganPerInstansi(instansiResponse.data.data);

      const trendResponse = await Api.get("/api/dashboard/trend-bulanan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrendBulanan(trendResponse.data.data);

      const statusResponse = await Api.get("/api/dashboard/distribusi-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDistribusiStatus(statusResponse.data.data);

      const visitorsResponse = await Api.get("/api/dashboard/recent-visitors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentVisitors(visitorsResponse.data.data);

      const periodeResponse = await Api.get(
        "/api/dashboard/perbandingan-periode",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPerbandinganPeriode(periodeResponse.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Initialize Charts
  useEffect(() => {
    let chartKategori, chartInstansi, chartTrend, chartStatus;

    // Chart Kunjungan Per Kategori (Pie Chart)
    if (kunjunganPerKategori.length > 0) {
      const kategoriSeries = kunjunganPerKategori.map((item) => item.total);
      const kategoriLabels = kunjunganPerKategori.map(
        (item) => item.kategori_nama
      );

      chartKategori = new ApexCharts(
        document.getElementById("chart-kategori"),
        {
          chart: {
            type: "donut",
            height: 300,
            fontFamily: "inherit",
          },
          series: kategoriSeries,
          labels: kategoriLabels,
          colors: ["#206bc4", "#4299e1", "#79c0ff", "#a5d8ff", "#d0ebff"],
          legend: {
            position: "bottom",
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toFixed(1) + "%";
            },
          },
          plotOptions: {
            pie: {
              donut: {
                size: "70%",
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: "Total",
                    formatter: function (w) {
                      return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                    },
                  },
                },
              },
            },
          },
        }
      );
      chartKategori.render();
    }

    // Chart Kunjungan Per Instansi (Bar Chart)
    if (kunjunganPerInstansi.length > 0) {
      const instansiNames = kunjunganPerInstansi.map((item) => item.instansi);
      const instansiTotals = kunjunganPerInstansi.map((item) => item.total);

      chartInstansi = new ApexCharts(
        document.getElementById("chart-instansi"),
        {
          chart: {
            type: "bar",
            height: 300,
            fontFamily: "inherit",
            toolbar: { show: false },
          },
          series: [
            {
              name: "Jumlah Kunjungan",
              data: instansiTotals,
            },
          ],
          xaxis: {
            categories: instansiNames,
            labels: {
              rotate: -45,
              style: { fontSize: "11px" },
            },
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return Math.round(val);
              },
            },
          },
          colors: ["#206bc4"],
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
              columnWidth: "60%",
            },
          },
          dataLabels: {
            enabled: false,
          },
          grid: {
            strokeDashArray: 4,
          },
        }
      );
      chartInstansi.render();
    }

    // Chart Trend Bulanan (Line Chart)
    if (trendBulanan.length > 0) {
      const trendLabels = trendBulanan.map((item) => item.bulan);
      const trendData = trendBulanan.map((item) => item.total);

      chartTrend = new ApexCharts(document.getElementById("chart-trend"), {
        chart: {
          type: "area",
          height: 300,
          fontFamily: "inherit",
          toolbar: { show: false },
        },
        series: [
          {
            name: "Jumlah Kunjungan",
            data: trendData,
          },
        ],
        xaxis: {
          categories: trendLabels,
          labels: {
            rotate: -45,
            style: { fontSize: "11px" },
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return Math.round(val);
            },
          },
        },
        colors: ["#206bc4"],
        stroke: {
          width: 2,
          curve: "smooth",
        },
        fill: {
          opacity: 0.16,
          type: "solid",
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          strokeDashArray: 4,
        },
      });
      chartTrend.render();
    }

    // Chart Distribusi Status (Donut Chart)
    if (distribusiStatus.length > 0) {
      const statusSeries = distribusiStatus.map((item) => item.total);
      const statusLabels = distribusiStatus.map((item) => item.status);
      const statusColors = distribusiStatus.map((item) => item.color);

      chartStatus = new ApexCharts(document.getElementById("chart-status"), {
        chart: {
          type: "donut",
          height: 300,
          fontFamily: "inherit",
        },
        series: statusSeries,
        labels: statusLabels,
        colors: statusColors,
        legend: {
          position: "bottom",
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(1) + "%";
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: "70%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total",
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  },
                },
              },
            },
          },
        },
      });
      chartStatus.render();
    }

    // Cleanup
    return () => {
      if (chartKategori) chartKategori.destroy();
      if (chartInstansi) chartInstansi.destroy();
      if (chartTrend) chartTrend.destroy();
      if (chartStatus) chartStatus.destroy();
    };
  }, [
    kunjunganPerKategori,
    kunjunganPerInstansi,
    trendBulanan,
    distribusiStatus,
  ]);

  const renderStatusBadge = (status) => {
    const config = getStatusBadge(status);
    return (
      <span className={`badge ${config.class}`}>
        <i className={`bx ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">Dashboard</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Statistik Cards */}
          <div className="row row-deck row-cards mb-3">
            {/* Card Total Tamu */}
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Total Tamu</div>
                    <div className="ms-auto">
                      <i className="bx bx-user fs-1 text-blue"></i>
                    </div>
                  </div>
                  <div className="h1 mb-0">{statistics.total_tamu}</div>
                  <div className="text-muted mt-2">Keseluruhan</div>
                </div>
              </div>
            </div>

            {/* Card Tamu Hari Ini */}
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Tamu Hari Ini</div>
                    <div className="ms-auto">
                      <i className="bx bx-calendar fs-1 text-green"></i>
                    </div>
                  </div>
                  <div className="h1 mb-0">{statistics.tamu_hari_ini}</div>
                  <div className="text-muted mt-2">
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Tamu Minggu Ini */}
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Tamu Minggu Ini</div>
                    <div className="ms-auto">
                      <i className="bx bx-time-five fs-1 text-yellow"></i>
                    </div>
                  </div>
                  <div className="h1 mb-0">{statistics.tamu_minggu_ini}</div>
                  <div className="text-muted mt-2">7 hari terakhir</div>
                </div>
              </div>
            </div>

            {/* Card Tamu Bulan Ini */}
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Tamu Bulan Ini</div>
                    <div className="ms-auto">
                      <i className="bx bx-bar-chart-alt-2 fs-1 text-purple"></i>
                    </div>
                  </div>
                  <div className="h1 mb-0">{statistics.tamu_bulan_ini}</div>
                  <div className="text-muted mt-2">
                    {new Date().toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Summary Cards */}
          <div className="row row-deck row-cards mb-3">
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Menunggu Konfirmasi</div>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-0 me-2">
                      {statistics.status_summary.pending}
                    </div>
                    <div className="text-muted">tamu</div>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="badge bg-yellow-lt">
                    Menunggu Konfirmasi
                  </span>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card rounded">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Disetujui</div>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-0 me-2">
                      {statistics.status_summary.approved}
                    </div>
                    <div className="text-muted">tamu</div>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="badge bg-green-lt">Disetujui</span>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-6">
              <div className="card rounded">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Tidak Bertemu</div>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-0 me-2">
                      {statistics.status_summary.not_met}
                    </div>
                    <div className="text-muted">tamu</div>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="badge bg-red-lt">Tidak Bertemu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Perbandingan Periode */}
          {/* {perbandinganPeriode && (
            <div className="row mb-3">
              <div className="col-12">
                <div className="card rounded">
                  <div className="card-body">
                    <h3 className="card-title">Perbandingan Periode</h3>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-2">
                          <span className="text-muted">
                            {perbandinganPeriode.bulan_lalu.label}
                          </span>
                        </div>
                        <div className="h2 mb-0">
                          {perbandinganPeriode.bulan_lalu.total} tamu
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-2">
                          <span className="text-muted">
                            {perbandinganPeriode.bulan_ini.label}
                          </span>
                        </div>
                        <div className="h2 mb-0">
                          {perbandinganPeriode.bulan_ini.total} tamu
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-2">
                          <span className="text-muted">Perubahan</span>
                        </div>
                        <div
                          className={`h2 mb-0 ${
                            perbandinganPeriode.perubahan.status === "naik"
                              ? "text-green"
                              : perbandinganPeriode.perubahan.status === "turun"
                              ? "text-red"
                              : "text-muted"
                          }`}
                        >
                          {perbandinganPeriode.perubahan.status === "naik" && (
                            <i className="bx bx-trending-up me-1"></i>
                          )}
                          {perbandinganPeriode.perubahan.status === "turun" && (
                            <i className="bx bx-trending-down me-1"></i>
                          )}
                          {perbandinganPeriode.perubahan.text}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Charts Row */}
          <div className="row mb-3">
            {/* Chart Kunjungan Per Kategori */}
            <div className="col-md-6">
              <div className="card rounded">
                <div className="card-header">
                  <h3 className="card-title">Kunjungan Per Kategori</h3>
                </div>
                <div className="card-body">
                  <div id="chart-kategori"></div>
                </div>
              </div>
            </div>

            {/* Chart Distribusi Status */}
            <div className="col-md-6">
              <div className="card rounded">
                <div className="card-header">
                  <h3 className="card-title">Distribusi Status</h3>
                </div>
                <div className="card-body">
                  <div id="chart-status"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Bulanan */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="card rounded">
                <div className="card-header">
                  <h3 className="card-title">Trend Kunjungan Bulanan</h3>
                </div>
                <div className="card-body">
                  <div id="chart-trend"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Kunjungan Per Instansi dan Recent Visitors */}
          <div className="row mb-3">
            {/* Chart Kunjungan Per Instansi */}
            <div className="col-md-8">
              <div className="card rounded">
                <div className="card-header">
                  <h3 className="card-title">Top 10 Instansi</h3>
                </div>
                <div className="card-body">
                  <div id="chart-instansi"></div>
                </div>
              </div>
            </div>

            {/* Recent Visitors */}
            <div className="col-md-4">
              <div className="card rounded">
                <div className="card-header">
                  <h3 className="card-title">Pengunjung Terbaru</h3>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {recentVisitors.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {recentVisitors.map((visitor, index) => (
                        <div key={index} className="list-group-item px-0">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <span className="avatar">
                                {visitor.nama_lengkap.charAt(0)}
                              </span>
                            </div>
                            <div className="col text-truncate">
                              <Link
                                to={`/tamu/${visitor.id}`}
                                className="text-reset d-block text-truncate"
                              >
                                {visitor.nama_lengkap}
                              </Link>
                              <div className="text-muted text-truncate mt-n1">
                                {visitor.instansi}
                              </div>
                              <small className="text-muted">
                                {visitor.kategori}
                              </small>
                            </div>
                            <div className="col-auto">
                              {renderStatusBadge(visitor.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted">Tidak ada data</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
