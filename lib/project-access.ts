export type ProjectRecord = {
  id: string;
  ownerId: string;
  title: string;
  status: string;
};

export function canAccessProject(
  project: Pick<ProjectRecord, "ownerId"> | null | undefined,
  userId: string | null | undefined,
): boolean {
  if (!project || !userId) {
    return false;
  }

  return project.ownerId === userId;
}

export function assertProjectOwnership(
  project: Pick<ProjectRecord, "ownerId"> | null | undefined,
  userId: string | null | undefined,
): ProjectRecord {
  if (!project) {
    throw new Error("Project access denied");
  }

  if (!canAccessProject(project, userId)) {
    throw new Error("Project access denied");
  }

  return project as ProjectRecord;
}
