import React from "react";
import { Flex, Heading, Spacer, Button, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaDownload } from "react-icons/fa";

const Navbar: React.FC = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:3000/report/export", {
        method: "GET",
        headers: {
          "Content-Type": "text/csv",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao baixar o CSV.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `courses-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar o CSV:", error);
      alert("Erro ao baixar o CSV");
    }
  };

  return (
    <Flex as="nav" p={4} alignItems="center" boxShadow="md">
      <Heading size="md">
        <Link to="/">Cursos</Link>
      </Heading>
      <Spacer />
      <HStack spacing={4} mr={4}>
        <Button
          onClick={handleDownload}
          colorScheme="teal"
          variant="outline"
          leftIcon={<FaDownload />}
        >
          Relatório
        </Button>
      </HStack>
      <HStack spacing={4}>
        <Button
          as={Link}
          to="/cadastrar-curso"
          colorScheme="teal"
          variant="outline"
        >
          Cadastrar Curso
        </Button>
      </HStack>
    </Flex>
  );
};

export default Navbar;
