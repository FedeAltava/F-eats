import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RegisterUser } from "../pages/RegisterUser";


export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
    </Router>
  );
};
