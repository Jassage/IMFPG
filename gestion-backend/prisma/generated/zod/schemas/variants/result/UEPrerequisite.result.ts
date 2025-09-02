import { z } from 'zod';

// prettier-ignore
export const UEPrerequisiteResultSchema = z.object({
    id: z.string(),
    ueId: z.string(),
    prerequisiteId: z.string(),
    ue: z.unknown(),
    prerequisite: z.unknown(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type UEPrerequisiteResultType = z.infer<typeof UEPrerequisiteResultSchema>;
