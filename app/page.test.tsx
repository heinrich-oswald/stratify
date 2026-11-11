import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";
import WorkspacePage from "./workspace/page";

describe("Phase 3 auth and workspace shell", () => {
  it("renders the sign-in experience for returning founders", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /welcome back, founder/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue to workspace/i })).toBeInTheDocument();
  });

  it("renders the protected founder workspace overview", () => {
    render(<WorkspacePage />);

    expect(screen.getByRole("heading", { name: /founder workspace/i })).toBeInTheDocument();
    expect(screen.getByText(/my plans/i)).toBeInTheDocument();
    expect(screen.getByText(/project setup/i)).toBeInTheDocument();
  });

  it("renders the 10-stage journey and lets the user review a stage", () => {
    render(<WorkspacePage />);

    expect(screen.getByRole("button", { name: /stage 1 — discover/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /stage 1 — discover/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /stage 3 — research/i }));

    expect(screen.getByRole("heading", { name: /stage 3 — research/i })).toBeInTheDocument();
    expect(screen.getAllByText(/research questions/i).length).toBeGreaterThan(0);
  });

  it("renders the research library and lets the student add a source", () => {
    render(<WorkspacePage />);

    expect(screen.getByRole("heading", { name: /research library/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/source title/i), {
      target: { value: "Interview with a library mentor" },
    });
    fireEvent.change(screen.getByLabelText(/source type/i), {
      target: { value: "Primary" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save source/i }));

    expect(screen.getByText(/interview with a library mentor/i)).toBeInTheDocument();
    expect(screen.getAllByText(/primary/i).length).toBeGreaterThan(0);
  });
});
