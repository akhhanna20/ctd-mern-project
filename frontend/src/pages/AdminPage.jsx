// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ Redirect unauthorized users
// import {
//   Box,
//   Heading,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Spinner,
//   Center,
// } from "@chakra-ui/react";

// function AdminPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem("token");
//       console.log(token);

//       if (!token) {
//         alert("Unauthorized access. Please log in.");
//         navigate("/login"); // ✅ Redirect if no token
//         return;
//       }

//       try {
//         const response = await fetch(
//           "http://localhost:8000/api/v1/admin/users",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`, // ✅ Send token for authentication
//             },
//             credentials: "include",
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch users");
//         }

//         const users = await response.json();
//         setUsers(users);
//       } catch (error) {
//         console.error("Error fetching users:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <Center h="98vh">
//       <Box p={8} bg="white" boxShadow="md" borderRadius="md" width="80%">
//         <Heading mb={4}>Admin Dashboard - Users List</Heading>

//         {loading ? (
//           <Spinner size="xl" />
//         ) : (
//           <Table variant="simple">
//             <Thead>
//               <Tr>
//                 <Th>Name</Th>
//                 <Th>Email</Th>
//                 <Th>Role</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {users.map((user) => (
//                 <Tr key={user._id}>
//                   <Td>{user.name}</Td>
//                   <Td>{user.email}</Td>
//                   <Td>{user.role}</Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         )}

//         {/* <Button colorScheme="red" mt={4} onClick={() => navigate("/tasks")}>
//           Go to Tasks
//         </Button> */}
//       </Box>
//     </Center>
//   );
// }

// export default AdminPage;
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
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized access. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized access. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
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
