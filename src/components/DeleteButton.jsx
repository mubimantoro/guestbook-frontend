import toast from "react-hot-toast";
import Api from "../services/Api";
import Cookies from "js-cookie";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";

export default function DeleteButton({ id, endpoint, fetchData }) {
  const token = Cookies.get("token");

  const confirmDelete = () => {
    confirmAlert({
      title: "Hapus Data?",
      message: "Apakah Anda ingin menghapus Data ini?",
      buttons: [
        {
          label: "YES",
          onClick: deleteData,
        },
        {
          label: "NO",
          onClick: () => {},
        },
      ],
    });
  };

  const deleteData = async () => {
    try {
      await Api.delete(`${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        toast.success(response.data.message, {
          duration: 4000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        fetchData();
      });
    } catch (error) {
      toast.error("Gagal menghapus Data!", {
        duration: 4000,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <button className="btn btn-danger rounded" onClick={confirmDelete}>
      Delete
    </button>
  );
}
