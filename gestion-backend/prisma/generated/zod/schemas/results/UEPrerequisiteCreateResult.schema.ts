import { z } from 'zod';
export const UEPrerequisiteCreateResultSchema = z.object({
  id: z.string(),
  ueId: z.string(),
  prerequisiteId: z.string(),
  ue: z.unknown(),
  prerequisite: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date()
});