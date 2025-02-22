// import { useState } from "react";
// // import "./App.css";

// function App() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const loginUser = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:8000/api/v1/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Login failed");
//       }

//       const data = await response.json();
//       console.log("Success:", data);

//       // Store only user info (avoid storing sensitive tokens in localStorage)
//       //localStorage.setItem("user", JSON.stringify(data.user));
//       localStorage.setItem("token", data.token); // ✅ Store token
//       localStorage.setItem("user", JSON.stringify(data.user));

//       alert("Login successful!");
//       window.location.href = "/tasks"; // Redirect
//     } catch (error) {
//       console.error("Error:", error.message);
//       alert(error.message);
//     }
//   };

//   // // Check if user is already logged in
//   // if (localStorage.getItem("user")) {
//   //   window.location.href = "/tasks"; // Redirect
//   // }
//   //

//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={loginUser}>
//         <input
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           type="email"
//           placeholder="Email"
//         />
//         <br />
//         <input
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           type="password"
//           placeholder="Password"
//         />
//         <br />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default App;
import { useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Success:", data);

      localStorage.setItem("token", data.token); // ✅ Store token
      console.log(data.token);
      localStorage.setItem("user", JSON.stringify(data.name));
      console.log(data.name);

      alert("Login successful!");

      console.log(data.role);
      // ✅ Check if user exists before accessing role
      if (data && data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/tasks";
      }
      // window.location.href = "/tasks"; // Redirect
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };
  ///////

  return (
    <Center height="96vh">
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        width={{ base: "90%", sm: "400px" }}
      >
        <Heading mb={6} textAlign="center">
          Login
        </Heading>
        <form onSubmit={loginUser}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal" // Light green button
              width="full"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
}

export default App;
