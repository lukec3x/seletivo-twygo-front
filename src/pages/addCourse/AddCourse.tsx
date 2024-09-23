import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { Course } from "../../types/courseTypes";

const AddCourse: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  // const [image, setImage] = useState<string>("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !endDate) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          ends_at: endDate,
          // image,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o curso");
      }

      const data: Course = await response.json();

      toast({
        title: "Curso criado",
        description: "O curso foi cadastrado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate(`/curso/${data.id}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o curso.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <Heading mb={6} textAlign="center">
        Cadastrar Novo Curso
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="title" isRequired>
            <FormLabel>Título</FormLabel>
            <Input
              placeholder="Título do curso"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              placeholder="Descrição do curso"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl id="endDate" isRequired>
            <FormLabel>Data de Término</FormLabel>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>
          {/* <FormControl id="image">
            <FormLabel>URL da Imagem</FormLabel>
            <Input
              placeholder="URL da imagem do curso"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </FormControl> */}
          <Button colorScheme="teal" type="submit" width="full">
            Cadastrar Curso
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddCourse;
