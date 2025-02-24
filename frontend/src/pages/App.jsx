import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Tasks from "../Tasks";
import Navbar from "../Navbar";
import Footer from "../Footer";
import AdminPage from "./AdminPage";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Footer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
