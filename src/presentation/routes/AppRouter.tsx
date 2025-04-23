import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
