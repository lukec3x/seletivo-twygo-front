// CourseDetail.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  AspectRatio,
  List,
  ListItem,
  ListIcon,
  Button,
  IconButton,
  VStack,
  HStack,
  Divider,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { Course, Video } from "../../types/courseTypes";
import {
  CheckCircleIcon,
  DeleteIcon,
  EditIcon,
  AddIcon,
} from "@chakra-ui/icons";
import VideoModal from "../../components/editVideoModal/EditVideoModal";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id!, 10);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState<boolean>(true);

  const [course, setCourse] = useState<Course>({
    title: "",
    description: "",
    ends_at: "",
    image: "",
    video_urls: [],
  });
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    course && course.video_urls.length > 0 ? course.video_urls[0] : null
  );

  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isEditingVideo, setIsEditingVideo] = useState<boolean>(false);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/course/${id}`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data: Course = await response.json();

      console.log(data);

      setCourse(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3000/course/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      toast({
        title: "Curso excluído",
        description: "O curso foi excluído com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao excluir o curso",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditCourse = () => {
    navigate(`/editar-curso/${courseId}`);
  };

  const handleAddVideo = () => {
    setCurrentVideo(null);
    setIsEditingVideo(false);
    onOpen();
  };

  const handleEditVideo = (video: Video) => {
    setCurrentVideo(video);
    setIsEditingVideo(true);
    onOpen();
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/course/${id}/video/${videoId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      fetchCourse();

      const updatedVideos = course.video_urls.filter(
        (video: Video) => video.id !== videoId
      );

      if (selectedVideo?.id === videoId) {
        setSelectedVideo(updatedVideos.length > 0 ? updatedVideos[0] : null);
      }

      toast({
        title: "Vídeo excluído",
        description: "O curso foi excluído com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);

      toast({
        title: "Erro ao excluir o video",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const convertToEmbedUrl = (videoUrl: string) => {
    let embedUrl = "";

    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const url = new URL(videoUrl);
      let videoId: string | null = "";

      if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.slice(1);
      } else if (url.hostname.includes("youtube.com")) {
        videoId = url.searchParams.get("v");
      }

      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    // if (videoUrl.includes("vimeo.com")) {
    //   const url = new URL(videoUrl);
    //   const videoId = url.pathname.split("/")[1];
    //   embedUrl = `https://player.vimeo.com/video/${videoId}`;
    // }

    return embedUrl;
  };

  const handleSaveVideo = async (video: Video) => {
    try {
      if (!video.url.includes("embed")) {
        video.url = convertToEmbedUrl(video.url.trim());
      }

      if (isEditingVideo && currentVideo) {
        // Editando um vídeo existente

        const response = await fetch(
          `http://localhost:3000/course/${id}/video/${currentVideo.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ update_video: video }),
          }
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        fetchCourse();

        if (selectedVideo?.id === currentVideo.id) {
          setSelectedVideo(video);
        }

        toast({
          title: "Vídeo atualizado",
          description: "O vídeo foi atualizado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Adicionando um novo vídeo

        const response = await fetch(
          `http://localhost:3000/course/${id}/video/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ create_video: video }),
          }
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        fetchCourse();

        toast({
          title: "Vídeo adicionado",
          description: "O vídeo foi adicionado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao editar o curso",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <HStack justifyContent="space-between">
        <Heading>{course.title}</Heading>
        <HStack spacing={2}>
          <IconButton
            aria-label="Editar Curso"
            icon={<EditIcon />}
            onClick={handleEditCourse}
          />
          <IconButton
            aria-label="Apagar Curso"
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={handleDeleteCourse}
          />
        </HStack>
      </HStack>
      <Text mt={4}>{course.description}</Text>

      <Divider my={6} />

      <VStack align="stretch" spacing={4}>
        <Box>
          <HStack justifyContent="space-between" mb={4}>
            <Heading size="md">Lista de Vídeos</Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="teal"
              onClick={handleAddVideo}
            >
              Adicionar Vídeo
            </Button>
          </HStack>
          <List spacing={3}>
            {course.video_urls.map((video) => (
              <ListItem
                key={video.id}
                cursor="pointer"
                bg={selectedVideo?.id === video.id ? "teal.100" : "transparent"}
                p={2}
                borderRadius="md"
              >
                <HStack
                  justifyContent="space-between"
                  onClick={() => setSelectedVideo(video)}
                >
                  <HStack>
                    <ListIcon as={CheckCircleIcon} color="teal.500" />
                    <Text>{video.title}</Text>
                  </HStack>
                  <HStack>
                    <IconButton
                      aria-label="Editar Vídeo"
                      icon={<EditIcon />}
                      size="sm"
                      onClick={() => handleEditVideo(video)}
                    />
                    <IconButton
                      aria-label="Apagar Vídeo"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteVideo(video.id)}
                    />
                  </HStack>
                </HStack>
              </ListItem>
            ))}
          </List>
        </Box>

        {selectedVideo && (
          <Box>
            <Heading size="md" mb={4}>
              {selectedVideo.title}
            </Heading>
            <AspectRatio maxW="800px" ratio={16 / 9}>
              <iframe
                title={selectedVideo.title}
                src={selectedVideo.url}
                allowFullScreen
              />
            </AspectRatio>
          </Box>
        )}
      </VStack>

      <VideoModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSaveVideo}
        video={currentVideo}
        isEditing={isEditingVideo}
      />
    </Box>
  );
};

export default CourseDetail;
