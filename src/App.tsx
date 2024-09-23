import React from "react";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Home from "./pages/home/Home";
import CourseDetail from "./pages/courseDetail/CourseDetail";
import AddCourse from "./pages/addCourse/AddCourse";
import EditCourse from "./pages/editCourse/EditCourse";
import Navbar from "./components/navbar/Navbar";

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/curso/:id" element={<CourseDetail />} />
        <Route path="/cadastrar-curso" element={<AddCourse />} />
        <Route path="/editar-curso/:id" element={<EditCourse />} />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
