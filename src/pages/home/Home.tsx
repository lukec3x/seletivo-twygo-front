import React, { useEffect } from "react";
import { Box, Grid, Heading } from "@chakra-ui/react";
import CourseCard from "../../components/courseCard/CourseCard";
import { Course } from "../../types/courseTypes";

const Home: React.FC = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/course");

        if (!response.ok) {
          throw new Error("Erro ao buscar cursos");
        }

        const data: { data: Course[] } = await response.json();

        console.log(data);

        setCourses(data.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Box p={4}>
      <Heading mb={6} textAlign="center">
        Cursos Ativos
      </Heading>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {courses.map((course: Course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
