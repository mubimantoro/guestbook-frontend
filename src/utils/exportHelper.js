import toast from "react-hot-toast";
import Api from "../services/Api";

export const downloadExcelFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};


export const exportTamuToExcel = async (token) => {
  try {
    const response = await Api.get("/api/tamu/export/excel", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    const timestamp = generateTimestamp();
    const filename = `tamu_export_${timestamp}.xlsx`;

    downloadExcelFile(response.data, filename);

    toast.success("Data berhasil diexport!", {
      position: "top-right",
      duration: 3000,
    });
    
    return true;
  } catch (error) {
    console.error("Export error:", error);
    
    if (error.response?.status === 403) {
      toast.error("Anda tidak memiliki izin untuk export data", {
        position: "top-right",
        duration: 4000,
      });
    } else if (error.response?.status === 500) {
      toast.error("Terjadi kesalahan di server", {
        position: "top-right",
        duration: 4000,
      });
    } else {
      toast.error("Gagal melakukan export data", {
        position: "top-right",
        duration: 4000,
      });
    }
    
    return false;
  }
};