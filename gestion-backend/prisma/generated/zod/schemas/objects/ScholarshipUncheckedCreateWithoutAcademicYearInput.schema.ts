import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationUncheckedCreateNestedManyWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUncheckedCreateNestedManyWithoutScholarshipInput.schema'

export const ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.ScholarshipUncheckedCreateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.ScholarshipUncheckedCreateWithoutAcademicYearInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  applications: z.lazy(() => ScholarshipApplicationUncheckedCreateNestedManyWithoutScholarshipInputObjectSchema).optional()
}).strict();
export const ScholarshipUncheckedCreateWithoutAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  applications: z.lazy(() => ScholarshipApplicationUncheckedCreateNestedManyWithoutScholarshipInputObjectSchema).optional()
}).strict();
