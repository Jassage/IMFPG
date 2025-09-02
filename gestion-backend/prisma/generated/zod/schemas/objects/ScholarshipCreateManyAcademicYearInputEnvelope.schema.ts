import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipCreateManyAcademicYearInputObjectSchema } from './ScholarshipCreateManyAcademicYearInput.schema'

export const ScholarshipCreateManyAcademicYearInputEnvelopeObjectSchema: z.ZodType<Prisma.ScholarshipCreateManyAcademicYearInputEnvelope, z.ZodTypeDef, Prisma.ScholarshipCreateManyAcademicYearInputEnvelope> = z.object({
  data: z.union([z.lazy(() => ScholarshipCreateManyAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ScholarshipCreateManyAcademicYearInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => ScholarshipCreateManyAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
