import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { Course } from "../../types/courseTypes";

const EditCourse: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(new Date().toISOString());
  // const [image, setImage] = useState<string>("");
  const toast = useToast();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:3000/course/${id}`);

        if (!response.ok) {
          return <Text>Curso não encontrado.</Text>;
        }

        const data: Course = await response.json();

        setTitle(data.title);
        setDescription(data.description);
        setEndDate(data.ends_at);
        // setImage(data.image);

        console.log("course", data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

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
      const response = await fetch(`http://localhost:3000/course/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          ends_at: endDate,
          // image,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao editar o curso");
      }

      toast({
        title: "Curso editaro",
        description: "O curso foi cadastrado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível editar o curso.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <Heading mb={6} textAlign="center">
        Editar Curso
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
              value={endDate.slice(0, 10)}
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
            Editar Curso
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EditCourse;
