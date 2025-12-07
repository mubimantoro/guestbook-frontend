import { useState } from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { exportTamuToExcel } from "../utils/exportHelper";

export default function ExportButton({
  buttonClass = "btn-success",
  buttonText = "Export Excel",
  onExportStart = () => {},
  onExportEnd = () => {},
  onExportSuccess = () => {},
  onExportError = () => {},
}) {
  const [isExporting, setIsExporting] = useState(false);
  const token = Cookies.get("token");

  const handleExport = async () => {
    setIsExporting(true);
    onExportStart();

    try {
      const success = await exportTamuToExcel(token);

      if (success) {
        onExportSuccess();
      } else {
        onExportError();
      }
    } catch (error) {
      console.error("Export error:", error);
      onExportError();
    } finally {
      setIsExporting(false);
      onExportEnd();
    }
  };

  return (
    <button
      className={`btn ${buttonClass}`}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <span className="spinner-border spinner-border-sm me-2"></span>
          Exporting...
        </>
      ) : (
        <>
          <i className="bx bx-download me-2"></i>
          {buttonText}
        </>
      )}
    </button>
  );
}

ExportButton.propTypes = {
  buttonClass: PropTypes.string,
  buttonText: PropTypes.string,
  onExportStart: PropTypes.func,
  onExportEnd: PropTypes.func,
  onExportSuccess: PropTypes.func,
  onExportError: PropTypes.func,
};
