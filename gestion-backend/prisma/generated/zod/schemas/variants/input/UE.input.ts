import { z } from 'zod';

import { UETypeSchema } from '../../enums/UEType.schema';
// prettier-ignore
export const UEInputSchema = z.object({
    code: z.string(),
    title: z.string(),
    credits: z.number().int(),
    type: UETypeSchema,
    passingGrade: z.number().int(),
    description: z.string().optional().nullable(),
    objectives: z.string().optional().nullable(),
    createdBy: z.unknown(),
    createdById: z.string(),
    prerequisites: z.array(z.unknown()),
    requiredFor: z.array(z.unknown()),
    assignments: z.array(z.unknown()),
    grades: z.array(z.unknown()),
    retakes: z.array(z.unknown())
}).strict();

export type UEInputType = z.infer<typeof UEInputSchema>;
