export const TamuStatus = {
  PENDING: 'Menunggu Konfirmasi',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
  NOT_MET: 'Tidak Bertemu',
};

export const getStatusBadge = (status) => {
  const statusConfig = {
    [TamuStatus.PENDING]: {
      class: 'bg-yellow',
      text: 'Menunggu Konfirmasi',
    },
    [TamuStatus.APPROVED]: {
      class: 'bg-green',
      text: 'Disetujui',
    },
    [TamuStatus.REJECTED]: {
      class: 'bg-red',
      text: 'Ditolak',
    },
    [TamuStatus.NOT_MET]: {
      class: 'bg-secondary',
      text: 'Tidak Bertemu',
    },
  };

  const config = statusConfig[status] || {
    class: 'bg-secondary',
    text: status || 'Tidak Diketahui',
  };

  return config;
};