import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
// import ProtectedRoute from "../ProtectedRoute";
import Tasks from "../Tasks";
import Navbar from "../Navbar";
import Footer from "../Footer";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Footer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            // <ProtectedRoute>
            <Tasks />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
