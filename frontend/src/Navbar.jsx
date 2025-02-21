import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => setToken(localStorage.getItem("token"));

    window.addEventListener("storage", checkToken); // Listen for token changes
    checkToken(); // ✅ Update immediately on render

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null); // ✅ Ensure UI updates
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        background: "teal", // Set background color to teal
        color: "white", // Make the text white to contrast with teal
      }}
    >
      <h2>Task Manager</h2>
      <div>
        {token ? (
          <>
            {/* <Link to="/tasks" style={{ marginRight: "10px", color: "white" }}>
              Tasks
            </Link> */}
            <button onClick={logout} style={{ color: "white" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "10px", color: "white" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
