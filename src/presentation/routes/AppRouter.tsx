import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { RestaurantDetails } from "../pages/RestaurantDetails";
import { SignUpUser } from "../pages/SignUpUser";
import { LoginUser } from "../pages/LoginUser";
import { RegisterUser } from "../pages/RegisterUser";
import { LoginRestaurant } from "../pages/LoginRestaurant";
import { SignUpRestaurant } from "../pages/SignUpRestaurant";
import { ProfileRestaurant } from "../pages/ProfileRestaurant";
import { RegisterDish } from "../pages/RegisterDish";      // ← importa tu formulario de platos
import { Cart } from "../pages/Cart";
import { ProtectedRoute } from "./ProtectedRoute";
import { NavBar } from "../components/NavBar";
import { ProfileUser } from "../pages/ProfileUser";

export const AppRouter = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/*Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/signup" element={<SignUpUser />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login-restaurant" element={<LoginRestaurant />} />
        <Route path="/signup-restaurant" element={<SignUpRestaurant />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        {/* Just autenticated restaurans */}
        <Route element={<ProtectedRoute allowedRole="restaurant" />}>
          <Route path="/register-restaurant" element={<ProfileRestaurant />} />
          <Route path="/restaurant/:id/add-dish" element={<RegisterDish />} />
        </Route>

        {/* Just autenticated Users */}
        <Route element={<ProtectedRoute allowedRole="user" />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<ProfileUser />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </Router>
  );
};
