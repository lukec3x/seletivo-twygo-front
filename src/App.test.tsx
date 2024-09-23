import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Mock the page components
jest.mock("./pages/home/Home", () => () => <div>Home Page</div>);
jest.mock("./pages/courseDetail/CourseDetail", () => () => (
  <div>Course Detail Page</div>
));
jest.mock("./pages/addCourse/AddCourse", () => () => (
  <div>Add Course Page</div>
));
jest.mock("./pages/editCourse/EditCourse", () => () => (
  <div>Edit Course Page</div>
));
jest.mock("./components/navbar/Navbar", () => () => <div>Navbar</div>);

const renderApp = (route: string) => {
  window.history.pushState({}, "Test page", route);

  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe("App Routing", () => {
  test("renders Home page for the root route", () => {
    renderApp("/");
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  test("renders CourseDetail page for /curso/:id route", () => {
    renderApp("/curso/1");
    expect(screen.getByText("Course Detail Page")).toBeInTheDocument();
  });

  test("renders AddCourse page for /cadastrar-curso route", () => {
    renderApp("/cadastrar-curso");
    expect(screen.getByText("Add Course Page")).toBeInTheDocument();
  });

  test("renders EditCourse page for /editar-curso/:id route", () => {
    renderApp("/editar-curso/1");
    expect(screen.getByText("Edit Course Page")).toBeInTheDocument();
  });

  test("always renders Navbar", () => {
    renderApp("/");
    expect(screen.getByText("Navbar")).toBeInTheDocument();
  });
});
