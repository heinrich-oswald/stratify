import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
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
});
