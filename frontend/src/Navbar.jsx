import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/login-status",
          {
            method: "GET",
            credentials: "include", // Include cookies (important for httpOnly cookies)
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Login status:", data);
          if (data.isAuthenticated === true) {
            setIsLoggedIn(true);
            fetchUserData(); // Fetch user data after login check
          } else {
            setIsLoggedIn(false);
          }
        } else if (response.status === 401) {
          setIsLoggedIn(false); // Handle 401 Unauthorized (user is logged out)
          console.log("User is not logged in.");
        } else {
          // Handle 401 Unauthorized and other errors
          setIsLoggedIn(false); // Handle other HTTP errors
          console.error("Error: Unable to check login status.");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };
    // Function to fetch user data (like name) after confirming login status
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/user", {
          method: "GET",
          credentials: "include", // Include cookies (important for httpOnly cookies)
        });

        if (response.ok) {
          const data = await response.json();
          //setUserName(data.name); // Set user name in the state
          console.log("User data:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkLoginStatus();
  }, []); // Empty dependency array ensures this runs only once when the component is mounted

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/logout", {
        method: "POST",
        credentials: "include", // Include cookies (important for httpOnly cookies)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Should log "User logged out"
        setIsLoggedIn(false); // Update the login status
        // Redirect to login page or home page
        window.location.href = "/login";
      } else {
        console.error("Logout failed", response.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
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
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} style={{ color: "white" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "10px", color: "white" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white" }}>
              SignUp
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
