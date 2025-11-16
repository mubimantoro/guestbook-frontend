import { useEffect, useState } from "react";
import { useStore } from "./stores/theme";
import AppRoutes from "./routes";

function App() {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
