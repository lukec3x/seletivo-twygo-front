import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "./Home";
import { Course } from "../../types/courseTypes";
import { act } from "react";

jest.mock("@chakra-ui/react", () => {
  const originalModule = jest.requireActual("@chakra-ui/react");
  return {
    ...originalModule,
    Box: (props: any) => <div>{props.children}</div>,
    Grid: (props: any) => <div>{props.children}</div>,
    Heading: (props: any) => <div>{props.children}</div>,
  };
});

jest.mock("../../components/courseCard/CourseCard", () => () => (
  <div>Course Card</div>
));

describe("Home Component", () => {
  const mockCourses: Course[] = [
    {
      id: 1,
      title: "Course 1",
      description: "Description 1",
      ends_at: "",
      image: "",
      video_urls: [],
    },
    {
      id: 2,
      title: "Course 2",
      description: "Description 2",
      ends_at: "",
      image: "",
      video_urls: [],
    },
  ];

  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers({ "Content-Type": "application/json" }),
        json: () => Promise.resolve({ data: mockCourses }),
      } as Response)
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the loading state initially", () => {
    render(<Home />);
    expect(screen.getByText(/Cursos Ativos/i)).toBeInTheDocument();
  });

  test("renders courses after successful fetch", async () => {
    await act(async () => {
      render(<Home />);
    });

    await waitFor(() =>
      expect(screen.getAllByText("Course Card")).toHaveLength(2)
    );
  });

  test("renders error message if fetch fails", async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() =>
        Promise.reject(new Error("Erro ao buscar cursos"))
      );

    await act(async () => {
      render(<Home />);

      waitFor(() =>
        expect(screen.getByText(/Erro ao buscar cursos/i)).toBeInTheDocument()
      );
    });
  });
});
