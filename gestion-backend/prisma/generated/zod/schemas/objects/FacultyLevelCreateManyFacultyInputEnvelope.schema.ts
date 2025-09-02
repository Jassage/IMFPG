import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelCreateManyFacultyInputObjectSchema } from './FacultyLevelCreateManyFacultyInput.schema'

export const FacultyLevelCreateManyFacultyInputEnvelopeObjectSchema: z.ZodType<Prisma.FacultyLevelCreateManyFacultyInputEnvelope, z.ZodTypeDef, Prisma.FacultyLevelCreateManyFacultyInputEnvelope> = z.object({
  data: z.union([z.lazy(() => FacultyLevelCreateManyFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateManyFacultyInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const FacultyLevelCreateManyFacultyInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => FacultyLevelCreateManyFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateManyFacultyInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
