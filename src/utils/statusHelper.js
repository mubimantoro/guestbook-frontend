export const getStatusBadge = (status) => {
  const statusConfig = {
    Pending: {
      class: "bg-warning text-dark",
      icon: "bx-time-five",
      text: "Menunggu",
    },
    Disetujui: {
      class: "bg-success",
      icon: "bx-check-circle",
      text: "Bertemu",
    },
    "Tidak Bertemu": {
      class: "bg-danger",
      icon: "bx-x-circle",
      text: "Tidak Bertemu",
    },
    "Dijadwalkan Ulang": {
      class: "bg-info",
      icon: "bx-calendar-exclamation",
      text: "Dijadwalkan Ulang",
    },
    Dibatalkan: {
      class: "bg-secondary",
      icon: "bx-block",
      text: "Dibatalkan",
    },
  };

  return (
    statusConfig[status] || {
      class: "bg-secondary",
      icon: "bx-help-circle",
      text: status,
    }
  );
};

export const getRatingBadge = (rating) => {
  if (rating >= 4) {
    return { class: "bg-success", text: "Sangat Baik" };
  } else if (rating >= 3) {
    return { class: "bg-primary", text: "Baik" };
  } else if (rating >= 2) {
    return { class: "bg-warning", text: "Cukup" };
  } else {
    return { class: "bg-danger", text: "Kurang" };
  }
};