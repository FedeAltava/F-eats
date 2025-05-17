import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RegisterUser } from "../pages/RegisterUser";
import { RegisterRestaurant } from "../pages/RegisterRestaurant";
import { Home } from "../pages/Home";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/register-restaurant" element={<RegisterRestaurant />} />
      </Routes>
    </Router>
  );
};
