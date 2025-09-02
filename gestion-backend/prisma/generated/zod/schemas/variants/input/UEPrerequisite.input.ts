import { z } from 'zod';

// prettier-ignore
export const UEPrerequisiteInputSchema = z.object({
    ueId: z.string(),
    prerequisiteId: z.string(),
    ue: z.unknown(),
    prerequisite: z.unknown()
}).strict();

export type UEPrerequisiteInputType = z.infer<typeof UEPrerequisiteInputSchema>;
