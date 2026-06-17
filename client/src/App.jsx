import { useState } from "react";
import Home  from "./pages/Home";
import Admin from "./pages/Admin";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  if (window.location.pathname.startsWith("/admin")) {
    return <Admin setToken={setToken} />;
  }
  return <Home />;
}
