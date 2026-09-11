import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RequireAuth, RequireAdmin } from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CharityList from "./pages/CharityList";
import CharityDetail from "./pages/CharityDetail";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import CategoryProducts from "./pages/CategoryProducts";
import Addresses from "./pages/Addresses";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCharities from "./pages/admin/AdminCharities";
import AdminCharityDetail from "./pages/admin/AdminCharityDetail";
import AdminCreateProduct from "./pages/admin/AdminCreateProduct";

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/charities" element={<CharityList />} />
            <Route path="/charities/:id" element={<CharityDetail />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories/:id" element={<CategoryProducts />} />

            <Route
              path="/address"
              element={
                <RequireAuth>
                  <Addresses />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <MyOrders />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <RequireAuth>
                  <OrderDetail />
                </RequireAuth>
              }
            />

            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="charities" element={<AdminCharities />} />
              <Route path="charities/:id" element={<AdminCharityDetail />} />
              <Route path="products/new" element={<AdminCreateProduct />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
