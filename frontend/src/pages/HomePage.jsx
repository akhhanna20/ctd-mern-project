// src/HomePage.js
import { Box, Button, Text, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom"; // Import Link for navigation

const HomePage = () => {
  return (
    <Center height="100vh" flexDirection="column">
      <Box textAlign="center" p={5}>
        <Text fontSize="3xl" mb={5}>
          Welcome to Our Task Management App!
        </Text>
        <Text fontSize="xl" mb={5}>
          Manage your tasks effectively and efficiently.
        </Text>

        {/* Buttons to navigate to different sections */}

        <Link to="/login">
          <Button colorScheme="teal" size="lg">
            Login
          </Button>
        </Link>

        <Link to="/register">
          <Button colorScheme="teal" size="lg">
            Register
          </Button>
        </Link>
      </Box>
    </Center>
  );
};

export default HomePage;
