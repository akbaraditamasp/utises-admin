import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import Restrict from "./components/Restrict";
import ComposeProduct from "./pages/ComposeProduct";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Sale from "./pages/Sale";
import service from "./service";

export default function App() {
  const [cookies] = useCookies();

  useEffect(() => {
    service.defaults.headers.common["Authorization"] = cookies.token
      ? `Bearer ${cookies.token}`
      : undefined;
  }, [cookies.token]);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Restrict status="unlogged" component={<Login />} />}
        />
        <Route
          path="/"
          element={<Restrict status="logged" component={<Layout />} />}
        >
          <Route path="/sales" element={<Sale />} />
          <Route path="/product/add" element={<ComposeProduct />} />
          <Route path="/product/:id" element={<ComposeProduct edit={true} />} />
          <Route path="/product" element={<Product />} />
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
