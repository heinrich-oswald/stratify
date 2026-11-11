import { describe, expect, it } from "vitest";
import { assertProjectOwnership, canAccessProject } from "./project-access";

describe("project ownership rules", () => {
  it("allows an owner to access their project", () => {
    const project = {
      id: "proj_123",
      ownerId: "user_abc",
      title: "Customer discovery sprint",
      status: "draft",
    };

    expect(canAccessProject(project, "user_abc")).toBe(true);
  });

  it("blocks a different user from accessing a project", () => {
    const project = {
      id: "proj_123",
      ownerId: "user_abc",
      title: "Customer discovery sprint",
      status: "draft",
    };

    expect(canAccessProject(project, "user_def")).toBe(false);
  });

  it("throws when a non-owner attempts an action", () => {
    const project = {
      id: "proj_123",
      ownerId: "user_abc",
      title: "Customer discovery sprint",
      status: "draft",
    };

    expect(() => assertProjectOwnership(project, "user_def")).toThrow(
      "Project access denied",
    );
  });
});
