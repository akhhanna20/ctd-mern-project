// import { useState } from "react";

// const Tasks = () => {
//   const [task, setTask] = useState("");

//   const createTask = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("You are not authorized to perform this action.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8000/api/v1/task/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ task }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create task");
//       }

//       const data = await response.json();
//       console.log("Task Created:", data);
//       setTask("");
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Tasks</h1>
//       <input
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//         placeholder="Enter task"
//       />
//       <button onClick={createTask}>Create Task</button>
//     </div>
//   );
// };

// export default Tasks;
//////////
// import {
//   Box,
//   Button,
//   Center,
//   FormControl,
//   FormLabel,
//   Input,
//   Stack,
//   Text,
// } from "@chakra-ui/react";
// import { useState, useEffect } from "react";

// const Task = () => {
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [daysToComplete, setDaysToComplete] = useState("");
//   const [taskToUpdate, setTaskToUpdate] = useState(null); // For updating a task

//   // Fetch tasks on component mount
//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // Fetch all tasks
//   const fetchTasks = async () => {
//     try {
//       const response = await fetch("http://localhost:8000/api/v1/tasks", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include", // Send cookies
//       });

//       if (!response.ok) {
//         throw new Error(`Error fetching tasks: ${await response.json()}`);
//       }

//       const data = await response.json();
//       console.log("Tasks:", data);
//       setTasks(data.tasks); // ✅ Update state with tasks
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     }
//   };

//   // Handle creating a task
//   const handleCreateTask = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:8000/api/v1/task/create", {
//         // Match the correct route /task/create
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ title, description, daysToComplete }),
//         credentials: "include", // Include credentials if using cookies for authentication
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setTasks([data, ...tasks]); // Add the new task to the tasks list
//         setTitle("");
//         setDescription("");
//         setDaysToComplete("");
//       } else {
//         console.error("Error creating task");
//       }
//     } catch (error) {
//       console.error("Error creating task", error);
//     }
//   };

//   // Handle deleting a task
//   const handleDeleteTask = async (taskId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/v1/task/${taskId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include", // Include credentials if using cookies for authentication
//         }
//       );

//       if (response.ok) {
//         setTasks(tasks.filter((task) => task._id !== taskId)); // Remove the deleted task from the state
//       } else {
//         console.error("Error deleting task");
//       }
//     } catch (error) {
//       console.error("Error deleting task", error);
//     }
//   };

//   // Handle updating a task (this can be a simple modal or form to edit task details)
//   const handleUpdateTask = async (e) => {
//     e.preventDefault();

//     if (!taskToUpdate) return;

//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/v1/task/${taskToUpdate._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ title, description, daysToComplete }),
//           credentials: "include",
//         }
//       );

//       if (response.ok) {
//         const updatedTask = await response.json();
//         setTasks(
//           tasks.map((task) =>
//             task._id === updatedTask._id ? updatedTask : task
//           )
//         );
//         setTaskToUpdate(null);
//         setTitle("");
//         setDescription("");
//         setDaysToComplete("");
//       } else {
//         console.error("Error updating task");
//       }
//     } catch (error) {
//       console.error("Error updating task", error);
//     }
//   };

//   return (
//     <Center height="100vh">
//       <Box textAlign="center" width="100%" maxWidth="600px" p={5}>
//         {/* Dynamic Greeting */}
//         <Text
//           fontSize={
//             tasks.length === 1 ? "2xl" : tasks.length > 1 ? "3xl" : "xl"
//           }
//           mb={6}
//         >
//           {tasks.length === 1
//             ? `Hello! You have 1 task`
//             : tasks.length > 1
//             ? `Hello! You have ${tasks.length} tasks`
//             : "Hello! You have no tasks"}
//         </Text>

//         {/* Task Form for Creating or Updating Tasks */}
//         <form onSubmit={taskToUpdate ? handleUpdateTask : handleCreateTask}>
//           <Stack spacing={4} mb={6}>
//             <FormControl isRequired>
//               <FormLabel>Title</FormLabel>
//               <Input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Task Title"
//               />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Description</FormLabel>
//               <Input
//                 type="text"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Task Description"
//               />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Days to Complete</FormLabel>
//               <Input
//                 type="number"
//                 value={daysToComplete}
//                 onChange={(e) => setDaysToComplete(e.target.value)}
//                 placeholder="Days"
//               />
//             </FormControl>
//             <Button type="submit" colorScheme="teal" width="full" mt={4}>
//               {taskToUpdate ? "Update Task" : "Create Task"}
//             </Button>
//           </Stack>
//         </form>

//         {/* Display Tasks */}
//         <Box>
//           {tasks.length > 0 ? (
//             tasks.map((task) => (
//               <Box
//                 key={task._id}
//                 mb={4}
//                 p={4}
//                 borderWidth={1}
//                 borderRadius="md"
//               >
//                 <Text fontSize="lg">
//                   <strong>{task.title}</strong> - {task.description} -{" "}
//                   {task.daysToComplete} days
//                 </Text>
//                 <Button
//                   colorScheme="red"
//                   size="sm"
//                   onClick={() => handleDeleteTask(task._id)}
//                   mt={2}
//                   mr={2}
//                 >
//                   Delete
//                 </Button>
//                 <Button
//                   colorScheme="blue"
//                   size="sm"
//                   onClick={() => {
//                     setTaskToUpdate(task);
//                     setTitle(task.title);
//                     setDescription(task.description);
//                     setDaysToComplete(task.daysToComplete);
//                   }}
//                   mt={2}
//                 >
//                   Update
//                 </Button>
//               </Box>
//             ))
//           ) : (
//             <Text>No tasks found.</Text>
//           )}
//         </Box>
//       </Box>
//     </Center>
//   );
// };

// export default Task;
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Text,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [daysToComplete, setDaysToComplete] = useState("");
  const [taskToUpdate, setTaskToUpdate] = useState(null); // For updating a task

  // Chakra UI modal hooks
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies
      });

      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${await response.json()}`);
      }

      const data = await response.json();
      setTasks(data.tasks); // Update state with tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/v1/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description, daysToComplete }),
        credentials: "include", // Include credentials if using cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        setTasks([data, ...tasks]); // Add the new task to the tasks list
        setTitle("");
        setDescription("");
        setDaysToComplete("");
        onClose(); // Close the modal after task creation
      } else {
        console.error("Error creating task");
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/task/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials if using cookies for authentication
        }
      );

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId)); // Remove the deleted task from the state
      } else {
        console.error("Error deleting task");
      }
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!taskToUpdate) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/task/${taskToUpdate._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, daysToComplete }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(
          tasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        );
        setTaskToUpdate(null);
        setTitle("");
        setDescription("");
        setDaysToComplete("");
      } else {
        console.error("Error updating task");
      }
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  return (
    <Center height="96vh">
      <Box textAlign="center" width="100%" maxWidth="1000px" p={5}>
        {/* Dynamic Greeting */}
        <Text
          fontSize={
            tasks.length === 1
              ? "4xl" // Larger font for 1 task
              : tasks.length > 1
              ? "4xl" // Even larger font for more than 1 task
              : "4xl" // Medium size for no tasks
          }
          mb={8}
        >
          {tasks.length === 1
            ? `Hello! You have 1 task`
            : tasks.length > 1
            ? `Hello! You have ${tasks.length} tasks`
            : "Hello! You have no tasks"}
        </Text>

        {/* Button to open Create Task Modal */}
        <Button onClick={onOpen} variant="outline" colorScheme="teal" mb={10}>
          Create Task
        </Button>

        {/* Task Form for Creating or Updating Tasks */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {taskToUpdate ? "Update Task" : "Create Task"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form
                onSubmit={taskToUpdate ? handleUpdateTask : handleCreateTask}
              >
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Task Title"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Task Description"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Days to Complete</FormLabel>
                    <Input
                      type="number"
                      value={daysToComplete}
                      onChange={(e) => setDaysToComplete(e.target.value)}
                      placeholder="Days"
                    />
                  </FormControl>
                  <ModalFooter>
                    <Button colorScheme="teal" type="submit">
                      {taskToUpdate ? "Update Task" : "Create Task"}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Stack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Display Tasks in Row */}
        <SimpleGrid
          columns={{ base: 1, md: 3 }} // Use one column on small screens, and 3 columns on medium screens and up
          spacing={4}
        >
          {tasks.length > 0 &&
            tasks.map((task) => (
              <Box
                key={task._id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                textAlign="center"
              >
                <Text fontSize="lg" fontWeight="bold">
                  {task.title}
                </Text>
                <Text>{task.description}</Text>
                <Text>{task.daysToComplete} days</Text>
                <Box display="flex" justifyContent="center" gap={4}>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteTask(task._id)}
                    mt={2}
                  >
                    Delete
                  </Button>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => {
                      setTaskToUpdate(task);
                      setTitle(task.title);
                      setDescription(task.description);
                      setDaysToComplete(task.daysToComplete);
                      onOpen(); // Open modal when updating
                    }}
                    mt={2}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            ))}
        </SimpleGrid>
      </Box>
    </Center>
  );
};

export default Task;
