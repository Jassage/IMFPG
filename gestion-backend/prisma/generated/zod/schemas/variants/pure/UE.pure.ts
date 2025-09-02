import { z } from 'zod';

import { UETypeSchema } from '../../enums/UEType.schema';
// prettier-ignore
export const UEModelSchema = z.object({
    id: z.string(),
    code: z.string(),
    title: z.string(),
    credits: z.number().int(),
    type: UETypeSchema,
    passingGrade: z.number().int(),
    description: z.string().nullable(),
    objectives: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdBy: z.unknown(),
    createdById: z.string(),
    prerequisites: z.array(z.unknown()),
    requiredFor: z.array(z.unknown()),
    assignments: z.array(z.unknown()),
    grades: z.array(z.unknown()),
    retakes: z.array(z.unknown())
}).strict();

export type UEModelType = z.infer<typeof UEModelSchema>;
