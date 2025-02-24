import { useState } from "react";
//import { useNavigate } from "react-router-dom"; // ✅ Use for navigation
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate(); // ✅ Use React Router for navigation

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ Ensures cookies are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Success:", data);
      console.log(data.role);

      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.name, role: data.role })
      );

      // ✅ Check if user exists before accessing role
      if (data && data.role === "admin") {
        window.location.href = "/admin";
        // navigate("/admin");
      } else {
        window.location.href = "/tasks";
        // navigate("/tasks");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

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
              colorScheme="teal"
              width="full"
              isDisabled={loading} // ✅ Disable when loading
            >
              {loading ? <Spinner size="sm" /> : "Login"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
}

export default Login;
