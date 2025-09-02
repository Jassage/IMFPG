import { z } from 'zod';

// prettier-ignore
export const UEPrerequisiteModelSchema = z.object({
    id: z.string(),
    ueId: z.string(),
    prerequisiteId: z.string(),
    ue: z.unknown(),
    prerequisite: z.unknown(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type UEPrerequisiteModelType = z.infer<typeof UEPrerequisiteModelSchema>;
