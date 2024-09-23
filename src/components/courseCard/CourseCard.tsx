import React from "react";
import { Box, Image, Heading, Text, Button, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { CourseCardProps } from "../../types/courseTypes";

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ boxShadow: "md" }}
    >
      <Image
        src="https://via.placeholder.com/400x200"
        // src={course.image}
        alt={course.title}
        objectFit="cover"
        width="100%"
        height="200px"
      />

      <Box p={4}>
        <Heading fontSize="xl" mb={2}>
          {course.title}
        </Heading>
        <Text mb={4}>{course.description}</Text>
        <Stack direction="row" spacing={4}>
          <Button as={Link} to={`/curso/${course.id}`} colorScheme="teal">
            Ver Curso
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CourseCard;
