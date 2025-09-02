import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateManyAcademicYearInputObjectSchema } from './GradeCreateManyAcademicYearInput.schema'

export const GradeCreateManyAcademicYearInputEnvelopeObjectSchema: z.ZodType<Prisma.GradeCreateManyAcademicYearInputEnvelope, z.ZodTypeDef, Prisma.GradeCreateManyAcademicYearInputEnvelope> = z.object({
  data: z.union([z.lazy(() => GradeCreateManyAcademicYearInputObjectSchema), z.lazy(() => GradeCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const GradeCreateManyAcademicYearInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => GradeCreateManyAcademicYearInputObjectSchema), z.lazy(() => GradeCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
