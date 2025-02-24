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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        credentials: "include", // Allow cookies to be sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      console.log("Success:", data);

      // Store user data (optional, but remove token storage)
      localStorage.setItem("user", JSON.stringify(data));

      window.location.href = "/login"; // Redirect after registration
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Center height="100vh">
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        width={{ base: "90%", sm: "400px" }}
      >
        <Heading mb={6} textAlign="center">
          Register
        </Heading>
        <form onSubmit={registerUser}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Name"
              />
            </FormControl>

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
              variant="solid"
              width="full"
            >
              Register
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
}

export default App;
