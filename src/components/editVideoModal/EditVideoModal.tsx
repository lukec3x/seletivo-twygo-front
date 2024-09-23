import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { VideoModalProps, Video } from "../../types/courseTypes";

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  video,
  isEditing,
}) => {
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setUrl(video.url);
    } else {
      setTitle("");
      setUrl("");
    }
  }, [video]);

  const handleSubmit = () => {
    if (!title || !url) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const newVideo: Video = video
      ? { ...video, title, url }
      : { id: Date.now().toString(), title, url };

    onSave(newVideo);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? "Editar Vídeo" : "Adicionar Vídeo"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="title" mb={4}>
            <FormLabel>Título</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl id="url">
            <FormLabel>URL do Vídeo</FormLabel>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="teal" onClick={handleSubmit}>
            {isEditing ? "Salvar Alterações" : "Adicionar Vídeo"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VideoModal;
