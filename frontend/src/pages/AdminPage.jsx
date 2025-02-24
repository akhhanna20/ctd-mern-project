//

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  Button,
} from "@chakra-ui/react";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Check if the user is logged in by making a request to the login-status endpoint
    const response = await fetch("http://localhost:8000/api/v1/login-status", {
      method: "GET",
      credentials: "include", // This ensures the browser sends the httpOnly cookie
    });

    if (!response.ok) {
      alert("Unauthorized access. Please log in.");
      navigate("/login");
      return;
    }

    try {
      // If the user is logged in, fetch the users
      const usersResponse = await fetch(
        "http://localhost:8000/api/v1/admin/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies with the request
        }
      );

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await usersResponse.json();
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies with the request
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove deleted user from state
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  return (
    <Center h="98vh">
      <Box p={8} bg="white" boxShadow="md" borderRadius="md" width="80%">
        <Heading mb={4}>
          Admin Dashboard - Users List - {users.length} users
        </Heading>

        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Center>
  );
}

export default AdminPage;
